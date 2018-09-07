const common = require("../../utils/common.js");
const app = getApp();//实例化app,需要设置globaldata值
Page({
  data: {
    inputPassword:false,
    username:'',
    password:'',
    info:'只有广东省核工业华南高级技工学校在校学生才有账号,其他人员无法登陆和注册',
    isLoading:false,
    userinfo:''
  },

  pwdFocus() {
    this.setData({
      inputPassword: true
    })
  },
  pwdBlur() {
    this.setData({
      inputPassword: false
    })
  },

  // 获取输入账号 
  usernameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  bindIdentity() {
    this.setData({
      isLoading: true
    })

    setTimeout(() => {
      this.setData({
        isLoading: false
      })
    }, 1000)

  },
  // 登录 
  login: function () {
    var that =this;
    if (that.data.username.length == 0 || that.data.password.length == 0) {
      common.showModal("用户名或密码不能为空!", "失败", "提示");
    } else {
      wx.Bmob.User.login(that.data.username,that.data.password).then(res =>{
        console.log(res);
          app.globalData.userobject = res;
          common.showTip("登陆成功!");
          // 这里修改成跳转的页面 
          wx.login({
            success: function (res) {
              wx.getUserInfo({
                success: function (res) {
                  //获取用户头像和昵称
                  var nickName = res.userInfo.nickName;
                  var userPic = res.userInfo.avatarUrl;
                  //保存全局变量
                  app.globalData.userInfo = res.userInfo;
                  //更新_User表,将用户的微信信息更新到记录中
                  const query = wx.Bmob.Query('_User');
                  query.get(app.globalData.userobject.objectId).then(res => {
                    res.set('nickName', nickName);
                    res.set('userPic', userPic);
                    res.save();
                    //保存用户缓存,objectId
                    wx.setStorageSync("objectId", app.globalData.userobject.objectId);
                    wx.setStorageSync("userInfo", res.userInfo);
                    wx.switchTab({
                      url: '../center/index',
                    })
                  }).catch(err => {
                    common.showModal("用户信息保存失败,请允许获取你的微信权限", "失败");
                  })
                }
              })
            }
          })
      }).catch(err =>{
        common.showModal("用户名或密码错误!","失败","提示");
      })

    }
  }
}) 