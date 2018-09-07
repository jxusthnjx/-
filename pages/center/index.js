Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishiden:false//如果用户已经登陆,就隐藏绑定账号按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    wx.getStorage({
      key: 'objectId',
      success: function(res) {
        that.setData({
          ishiden:true
        })
      },
    })
  },
//建议反馈
  suggest:function(){
    wx.navigateTo({
      url: 'suggest/suggest',
    })
  },
//关于小程序
about:function(){
  wx.navigateTo({
    url: 'about/about',
  })

},
  //密码修改
  modify: function () {
    wx.getStorage({
      key: 'objectId',
      success: function (res) {
        wx.navigateTo({
          url: 'modify/modify',
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '你还未绑定账号!',
        })
      }
    })
  },

  login:function(e){
    wx.getStorage({
      key: 'objectId',
      success: function(res) {
        wx.showToast({
          title: '你已经绑定过,无需再绑定',
        })
      },
      fail:function(res){
        wx.navigateTo({
          url: '../Login/login',
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})