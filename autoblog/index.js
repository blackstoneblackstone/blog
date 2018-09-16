/**
 * Created by lihongbin on 2018/8/19.
 */
const fs = require("fs")
const path = require("path")
const axios = require("axios")
const express = require("express")
const http = require('http')
const process = require('child_process')
var bookIndex = 0

function share(shareKey) {
  const sharePath = `https://note.youdao.com/yws/api/personal/share?method=get&shareKey=${shareKey}`
  axios.get(sharePath).then(function (e) {
    if (e.data.entry.oldEntryPath) {
      var pathName = e.data.entry.oldEntryPath.replace("/", "")
      start("blog", pathName, shareKey)
    }
  })
  setTimeout(function () {
    process.exec("npm run d")
  }, 10000)
}
function start(tl, pathName, userPath) {
  const myBlog = `https://note.youdao.com/yws/public/notebook/${userPath}/subdir/${pathName}?cstk=a7IDfYio`
  axios.get(myBlog).then((e) => {
    let datas = e.data[2]
    for (data of datas) {
      let pathId = data.p.match(/\/\w*$/g)[0]
      if (data.tl.indexOf(".md") > -1) {
        let title = data.tl.replace(".md", "")
        let day = dateForm(data.ct)
        let purl = `https://note.youdao.com/yws/api/personal/file/${pathId}?method=download&read=true&shareKey=${userPath}&cstk=a7IDfYio`
        axios.get(purl).then((e) => {
          fw(pathId, e.data, title, tl, day)
        }).catch((e) => {
          console.log("错误=====》", e)
        })
        continue
      }
      if (data.tl.indexOf(".note") > -1) {
        let day = dateForm(Number(data.ct))
        let noteUrl = `https://note.youdao.com/yws/public/note/${userPath}/${pathId}?editorType=0&cstk=a7IDfYio`
        axios.get(noteUrl).then((e) => {
          fw(pathId, e.data.content, e.data.tl, tl, day)
        }).catch((e) => {
          console.log("错误=====》", e)
        })
        continue
      }
      start(data.tl, pathId, userPath)
    }
  }).catch((e) => {
    console.log("错误=====》", e)
  })
}


function fw(fileName, content, title, tl, day) {
  console.log("正在写入=>" + (++bookIndex) + "=>", title)
  let count = Math.ceil(content.length / 200)
  content = `
  title: ${title}
  tags: 
    - ${tl}
  categories: 
    - ${tl}
  comments: true
  count: ${count}
  date: ${day}
  ---
  ` + content

  var filePath = path.resolve(`./source/_posts/${fileName}.md`)

  fs.open(filePath, 'wx', (err, fd) => {
    fs.writeFileSync(filePath, content);
  });
}

function dateForm(dat) {
  var da = new Date(dat * 1000);
  var year = da.getFullYear() + ""
  var month = da.getMonth() + 1 + ""
  var date = da.getDate() + ""
  return [year, month, date].join('/')
}

function removeDir(dir) {
  let files = fs.readdirSync(dir)
  for (var i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath)
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      removeDir(newPath);
    } else {
      //删除文件
      fs.unlinkSync(newPath);
    }
  }
}
//http://localhost:10000/refresh?userPath=WEBdeca409426648580d9ecdc8c1285a7e5&pathName=68223916cc24226197cdb4defa392e3f
const app = express()
app.use('/refresh', function (req, res, next) {
  var shareKey = req.param("shareKey")
  removeDir(path.resolve("./source/_posts"))
  var l = share(shareKey)
  res.send(`{"code":200,"data":${l}}`);
});
app.use('/info', function (req, res, next) {
  var id = req.param("id")
  res.send(`{"code":200,"id":${id}`);
});
app.use('/save', function (req, res, next) {
  var id = req.param("id")
  console.log(id)
  res.send(`{"code":200,"id":${id}`);
});
var server = http.createServer(app);
server.listen(10000);



