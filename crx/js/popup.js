/**
 * Created by lihongbin on 2018/9/16.
 */
$(function () {
  var userPath = $("#userPath").val()
  var pathName = $("#pathName").val()
  var refresh = $("#refresh")
  chrome.tabs.getSelected(null, function (tab) {
    $("#content").text(tab.url)
  });
  // var url = "http://www.simamedia.cn:10000/refresh?userPath=" + userPath + "&pathName=" + pathName
  // refresh.click(function () {
  //   $.ajax({
  //     url: url,
  //     success: function (e) {
  //       alert(e.code)
  //     }
  //   })
  // })
})
