Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  suggests:function(e){
    //console.log(e.detail.value.description);
    var content =e.detail.value.description;
    console.log(content)
    if(!!content){
      const query = wx.Bmob.Query('suggest');
      query.set('content', content);
      query.save().then(res => {
        wx.showToast({
          title: '发送成功!',
        })
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../index',
        })
      }, 2000)
    }else{
      wx.showToast({
        title: '内容不能为空',
      })
    }

    

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