var common = require("../../utils/common.js");
var grids = [
  {"name":"考证类","ico":"kaozheng.png","url":"tiList/tilist?id=0"},
  { "name": "基础类", "ico": "jichu.png", "url":"tiList/tilist?id=1"},
  { "name": "电商类", "ico": "dianshang.png", "url":"tiList/tilist?id=2"},
  { "name": "机械类", "ico": "jixie.png", "url":"tiList/tilist?id=3"},
  { "name": "机电类", "ico": "jidian.png", "url":"tiList/tilist?id=4"},
  { "name": "汽修类", "ico": "qixiu.png", "url": "tiList/tilist?id=5" },
  { "name": "面试类", "ico": "mianshi.png", "url": "tiList/tilist?id=6" },
  { "name": "其它类", "ico": "qita.png", "url":"tiList/tilist?id=7"},
  { "name": "在线考试", "ico": "exam.png", "url": "tiList/tilist?id=8" },
  { "name": "我的收藏本", "ico": "shoucang.png", "url": "answer_info/answer_info?objectId=9" },
  
];

Page({
  data:{
    grids:grids,
  },
  autoLogin:function(){
    common.showModal("App.js实现小程序访问将数据写入系统User表，具体代码请查看App.js。")
  }
})