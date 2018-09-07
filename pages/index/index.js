var app=getApp();
//const cache = Object.create(null);
//var common = require('../../utils/common.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _isLoading: false,
    articles: [],
    swiperList:[],//轮播图
    //page: 3,//当前请求的页数
    currentPage: 0,//当前请求的页数
    pageSize: 10,//每次加载多少条
    total:0,//新闻总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getTotal();//计算文章总数量
    this.getSwiperList();
    this.getnewlist();//读取文章列表
  },

//获取轮播图信息
  getSwiperList:function(){
    var that =this;
    const query=wx.Bmob.Query('sysinfo');
    query.equalTo('name','==','pic');
    query.find().then(res=>{
      var swiperlist=that.data.swiperList;
      for(var i=0;i<res.length;i++){
        swiperlist.push(res[i]);
      }
      that.setData({
        swiperList:swiperlist
      })
    })
  },
//加载新闻列表
  getnewlist:function(){
    var that = this;
    const query = wx.Bmob.Query("_Article");//查询数据
    query.limit(that.data.pageSize);//分页查询,一次查询that.data.page条
    query.skip(that.data.pageSize * that.data.currentPage);//跳过查询前面n条数据
    query.order("-createdAt");
    query.find().then(res => {
      if(res.length==0)
      {
        wx.showToast({
          title: '没有更多了',
        })
      }
      else{
        var data = that.data.articles;
        for (var i = 0; i < res.length; i++) {
          data.push(res[i]);
        }
        that.data.currentPage++;
        that.setData({
          articles: data
        })
      }
      
    }); 
  },

//计算文章总数量,在onload中使用,只运行一次
  getTotal:function(){
    var that =this;
    const query =wx.Bmob.Query("_Article");
    
    query.count().then(res =>{
      that.setData({
        
        total:res
      })
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
    var that =this;
    that.setData({
      currentPage:0,
      articles:[]
    })
    that.getnewlist();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getnewlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  
})