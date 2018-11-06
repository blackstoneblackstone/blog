/**
 * Created by lihongbin on 2018/11/5.
 */
const fs = require("fs")
const path = require("path")
const axios = require("axios")
const process = require('child_process')
const downLoadImg = require('./downLoadImg')

var bookIndex = 0

function shareLoad(shareKey) {
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
          //下载图片
          let content = downLoadImg.md(e.data)
          //保存文本
          fw(pathId, content, title, tl, day)
        }).catch((e) => {
          console.log("错误=====》", e)
        })
        continue
      }
      if (data.tl.indexOf(".note") > -1) {
        let day = dateForm(Number(data.ct))
        let noteUrl = `https://note.youdao.com/yws/public/note/${userPath}/${pathId}?editorType=0&cstk=a7IDfYio`
        axios.get(noteUrl).then((e) => {
          //下载图片
          let content = downLoadImg.note(e.data.content)
          //保存文本
          fw(pathId, content, e.data.tl, tl, day)
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
  content = `title: ${title}
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

module.exports = {
  shareLoad,
  removeDir
}