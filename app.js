//app.js

var Bmob = require('utils/Bmob-1.6.2.min.js');
Bmob.initialize("你的Application ID", "你的REST API Key","你的MASTER Key");
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    userobject:null,
    error:[],//考试错题全局变量,页面不能传递对象
  }
})