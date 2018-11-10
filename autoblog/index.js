/**
 * Created by lihongbin on 2018/8/19.
 */
const http = require('http')
const fs = require("fs")
const path = require("path")
const express = require("express")

const app = express()

const {removeDir, shareLoad} = require('./shareLoader')
//http://localhost:10000/refresh?userPath=WEBdeca409426648580d9ecdc8c1285a7e5&pathName=68223916cc24226197cdb4defa392e3f
app.use('/refresh', function (req, res, next) {
  req.headers.origin == 'http://yondu.vip' || req.headers.origin == 'https://yondu.vip' ?
    res.header("Access-Control-Allow-Origin", req.headers.origin) : "";
  var shareKey = req.param("shareKey")
  removeDir(path.resolve("./source/_posts"))
  var l = shareLoad(shareKey)
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



