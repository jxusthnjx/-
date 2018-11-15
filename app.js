//app.js

var Bmob = require('utils/Bmob-1.6.2.min.js');
Bmob.initialize("你自己的application id", "你自己的REST api key");
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    userobject:null,
    error:[],//考试错题全局变量,页面不能传递对象
  }
})
