/**
 * Created by lihongbin on 2018/8/19.
 */
const fs = require("fs")
const path = require("path")
const axios = require("axios")
const express = require("express")
var bookIndex = 0

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
      start(data.tl, pathId)
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
const app = express()
app.use('/refresh', function (req, res, next) {
  var userPath = req.param("userPath")
  var pathName = req.param("pathName")
  start("blog", userPath, pathName)
  res.send(`{"code":200}`);
});
app.use('/info', function (req, res, next) {
  var id = req.param("id")
  console.log(id)
  res.send(`{"code":200,"id":${id}`);
});
app.use('/save', function (req, res, next) {
  var id = req.param("id")
  console.log(id)
  res.send(`{"code":200,"id":${id}`);
});







