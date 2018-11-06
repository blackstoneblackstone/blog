/**
 * Created by lihongbin on 2018/11/5.
 */
const request = require('request')
const md5 = require('md5')
const path = require('path')
const fs = require('fs')

const dest = path.resolve("source/images") + "/"

const downloadPic = function (src) {
  let newPic = dest + md5(src) + ".png"
  if (fs.existsSync(newPic)) {
    console.log(newPic + "  exists!!!!")
  } else {
    request(src).pipe(fs.createWriteStream(newPic)).on('close', function () {
      console.log(newPic + "  saved!")
    })
  }
}

module.exports = {
  note:function (content) {
  let exp = /img (data-media-type="image" )?src="\S+"/g
  let urls = content.replace(exp, function (x) {
    let temp = x.replace(/(http|https){1}\S+/, function (w) {
      let wx = w.replace('"', "")
      //下载PIC
      downloadPic(wx)
      let newPic = "/images/" + md5(wx) + ".png"
      return newPic
    })
    return temp+'"'
  })
  return urls
},
  md:function (content) {
    let exp = /\!\[[^\]]+\]\([^\)]+\)/g
    let urls = content.replace(exp, function (x) {
      let temp = x.replace(/(http|https){1}\S+/, function (w) {
        let wx = w.replace('\)', "")
        //下载PIC
        let newPic = "/images/" + md5(wx) + ".png"
        return newPic
      })
      return temp+')'
    })
    return urls
  }
}


