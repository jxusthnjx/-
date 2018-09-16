//app.js

var Bmob = require('utils/Bmob-1.6.2.min.js');
Bmob.initialize("597eea39d5b9108121b0baf1613f3dd8", "afb8a30f378a922234842209b54ed85e","31ae444e19077f1c7dcff0196eaf3297");
App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null,
    userobject:null,
    error:[],//考试错题全局变量,页面不能传递对象
  }
})