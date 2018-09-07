Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that= this;
    wx.getStorage({
      key: 'objectId',
      success: function(res) {
        that.setData({
          userid:res
        })
      },
      fail:function(res){
        wx.showModal({
          title: '失败',
          content: '你还未登陆',
        })
      }
    })
  },

//修改密码
  editpwd:function(e){
    var that=this;
    var xin =e.detail.value.xin;
    var queren = e.detail.value.queren;
    //如果原始密码错误
        if(!!xin){//新密码不为空
          if(xin==queren){//俩次输入密码相等
            const query =wx.Bmob.Query('_User');
            query.equalTo('username','==',that.data.userid);
            query.find().then(res=>{
              res.set('password',xin);
              res.save();
              wx.showToast({
                title: '密码修改成功!',
              })
            }).catch(err=>{
              wx.showToast({
                title: '密码修改失败!',
              })
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../index',
              })
            }, 2000)
          }else{
            wx.showToast({
              title:'两次密码不一致!',
            })
          }

        }else{//新密码为空
          wx.showToast({
            title: '请输入新密码!',
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