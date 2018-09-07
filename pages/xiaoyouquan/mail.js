//index.js
//获取应用实例
var common = require('../../utils/common.js')
var app = getApp()
//var that;

Page({
  data: {
    moodList: [],//心情数据列表
    limit: 0,
    page: 5,//当前请求的页数
    currentPage: 0,//当前请求的页数
    isload: false,
    isEmpty: true,
    pageSize: 5,//每次加载多少条
    // limit: 2,//跟上面要一致
    loading: false,
    windowHeight1: 0,
    windowWidth1: 0,
    count: 0,
    scrollTop: {
      scroll_top1: 0,
      goTop_show: false
    },
    
  },

  onLoad: function (t) {
    this.getReturn();
  },

  onShow: function (e) {
    
  },

  onShareAppMessage: function () {
    return {
      title: '心邮',
      desc: '倾诉烦恼，邮寄心情，分享快乐',
      path: '/pages/index1/index1'
    }
  },

  onReachBottom: function () {
    this.getReturn();
  },


  onPullDownRefresh: function () {
    var that =this;
    
    that.setData({
      moodList:[],
      currentPage:0,

    })
    that.getReturn();
    wx.stopPullDownRefresh();
  },
  scrollTopFun: function (e) {
    if (e.detail.scrollTop > 300) {
      this.setData({
        'scrollTop.goTop_show': true
      });
    } else {
      this.setData({
        'scrollTop.goTop_show': false
      });
    }
  },

  thewrite:function(){
    wx.getStorage({
      key: 'objectId',
      success: function(res) {
        var objectId =res.data;
        const query = wx.Bmob.Query('_User');
        query.get(objectId).then(res => {
          if (!res.isPost) {
            wx.showModal({
              title: '提示',
              content: '由于你此前发表过不恰当言论,已禁止发表心情!',
            })
          } else {
            wx.navigateTo({
              url: 'write/write',
            })
          }
        })
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          content: '你未登陆,现在登陆?',
          success:function(res){
            if(res.confirm){
              wx.navigateTo({
                url: '../Login/login',
              })
            }
          }
        })
      }
    })

  },

  getReturn: function () {
     var that =this;
     that.setData({
       isload:false,
     })
    //var Diary = bmob.Object.extend("Diary");
    //var query = new bmob.Query(Diary);
    const query = wx.Bmob.Query("Diary");//查询数据
    query.equalTo('is_hide','==','0');
    query.limit(that.data.page * (that.data.currentPage+1));//每次加载page条数据
    query.skip(that.data.page * that.data.currentPage);//跳过前面n条数据
    //条件查询
    //query.equalTo("is_hide","==", "0");
    //if (value) {
    //  query.equalTo("title", { "$regex": "" + value + ".*" });
    //}
    //query.descending("createdAt");
    query.order("-createdAt");//按时间排序
    query.include("publisher");//查询对应作者的信息,也就是将_User表信息加进来
    // 查询所有数据
    query.find().then(results =>{
      if (results.length == 0) {
        wx.showToast({
          title: '没有更多了',
        })
        that.setData({
          
          isload: true,
        })
      }
      else {
        var data = that.data.moodList;
        for (var i = 0; i < results.length; i++) {
          //var publisherId = results[i].get("publisher").id;
          var publisherId = results[i].publisher.objectId;
          //var title = results[i].get("title");
          var title = results[i].title;
          //var content = results[i].get("content");
          var content = results[i].content;
          //var id = results[i].id;
          var id = results[i].objectId;
          var createdAt = results[i].createdAt;
          var _url;
          //var likeNum = results[i].get("likeNum");
          var likeNum = results[i].likeNum;
          //var commentNum = results[i].get("commentNum");
          var commentNum = results[i].commentNum;

          //var pic = results[i].get("pic");
          var pic = results[i].pic;
          if (pic) {
            //_url = results[i].get("pic")._url;
            _url = results[i].pic.url;
          }
          else {
            _url = null;
          }
          //var name = results[i].get("publisher").get("nickname");
          var name = results[i].publisher.nickName;
          //var userPic = results[i].get("publisher").get("userPic");
          var userPic = results[i].publisher.userPic;
          //var liker = results[i].get("liker");
          var liker = results[i].liker;//点赞者
          var isLike = 0;
          // for (var j = 0; j < liker.length; j++) {
          //   if (liker[j] == ress.data) {
          //     isLike = 1;
          //     break;
          //   }
          // }
          var jsonA;
          if (pic) {
            jsonA = {
              "title": title || '',
              "content": content || '',
              "id": id || '',
              "avatar": userPic || '',
              "created_at": createdAt || '',
              "attachment": _url || '',
              "likes": likeNum,
              "comments": commentNum,
              "is_liked": isLike || '',
              "username": name || ''
            }
          }
          else {
            jsonA = {
              "title": title || '',
              "content": content || '',
              "id": id || '',
              "avatar": userPic || '',
              "created_at": createdAt || '',
              "attachment": _url || '',
              "likes": likeNum,
              "comments": commentNum,
              "is_liked": isLike || '',
              "username": name || ''
            }
          }

          data.push(jsonA);
          that.setData({
            moodList: data,
            isload: true,
            
          })

          // that.setData({
          //   moodList: molist,
          //   // loading: true
          // })
        }

        that.data.currentPage++;
      }

    }).catch(err =>{

    })

  },

})

