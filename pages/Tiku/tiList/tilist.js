var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tilist:[],
    category:'',//用户点击的类别
    num:[],
    ismonikao:false//是否是模拟考课程
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取页面传过来的值,点击的类别
    var that =this;
    var id= options.id;
    that.setData({
      category:id
    })
    this.getTiList();
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
    
  },
  //获取列表
  getTiList:function(){
    var that =this;
    //如果用户点击了在线考试
    if (that.data.category=='8'){
      const query =wx.Bmob.Query('course');
      query.equalTo('ismonikao','==',true);
      query.find().then(res=>{
        that.setData({
          tilist:res,
          ismonikao:true
        })
      })
      //console.log(that.data.tilist.length)

    }else{
      const query = wx.Bmob.Query('course');
      query.equalTo('category', '==', that.data.category);
      query.find().then(res => {
        //查找没门课程有多少道题目
        that.setData({
          tilist: res,
          ismonikao:false
        })
        //console.log(res);
       // console.log(that.data.tilist);
      })
    }

  },

  getAnswer_info:function(e){
    var that=this;
    var objectid=e.currentTarget.dataset.objectid;
    if(that.data.ismonikao){
      wx.navigateTo({
        url: '../kaoshi/kaoshi?objectId=' + objectid,
      })
    }else{
      wx.navigateTo({
        url: '../answer_info/answer_info?objectId=' + objectid,
      })
    }

  }
})