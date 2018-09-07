
//获取应用实例
var app = getApp()
//var that;
var optionId;//心情ID,接受页面传值
var commentlist;
Page({
  data: {
    limit: 5,
    showImage: false,
    loading: false,
    isdisabled: false,
    commentLoading: false,
    isdisabled1: false,
    recommentLoading: false,
    commentList: [],
    agree: 0//是否已点赞
  },

  onLoad: function (options) {
   var that = this;
   wx.getStorage({
     key: 'objectId',
     success: function(res) {
       
      optionId=options.moodId
       
       that.show();
     },
     fail:function(){
       wx.showModal({
         title: '提示',
         content: '你还未登陆,去登陆?',
         success:function(res){
           if(res.confirm){
             wx.navigateTo({
               url: '../../Login/login',
             })
           }else if(res.cancel){
             wx.switchTab({
               url: '../mail',
             })
           }

         }
       })
     }
   })
  },

  onReady: function () {
    wx.hideToast()

  },
//显示
  show:function(){
    var that =this;
    var myInterval = setInterval(getReturn, 500);
    function getReturn() {
      wx.getStorage({
        key: 'objectId',
        success: function (ress) {//ress获取的是用户账号objectId
          if (ress.data) {
            //console.log(ress.data);
            clearInterval(myInterval)
            const query = wx.Bmob.Query('Diary');//查询心情表
            query.equalTo("objectId", '==', optionId);
            query.include("publisher");//查询发表者信息加入进来
            query.find().then(result => {
              var title = result[0].title;
              var content = result[0].content;
              var publisher = result[0].publisher;
              var agreeNum = result[0].likeNum;
              var commentNum = result[0].commentNum;
              var ishide = result[0].is_hide;
              var liker = result[0].liker;
              var userNick = publisher.nickName;
              var objectIds = publisher.objectId;//心情作者ID

              var isPublic;
              var userPic;
              var url;
              if (publisher.userPic) {
                userPic = publisher.userPic;//用户头像
              }
              else {
                userPic = null;
              }
              if (result[0].pic) {
                url = result[0].pic.url;//心情图片
              }
              else {
                url = null;
              }
              if (publisher.objectId == ress.data) {//如果心情作者是自己
                that.setData({
                  isMine: true
                })
              }
              if (ishide == 0) {//不公开
                isPublic = false;
              }
              else {
                isPublic = true;//公开
              }
              that.setData({
                listTitle: title,
                listContent: content,
                listPic: url,
                agreeNum: agreeNum,
                commNum: commentNum,
                ishide: ishide,
                isPublic: isPublic,
                userPic: userPic,
                userNick: userNick,
                objectIds: objectIds,
                loading: true
              })
              for (var i = 0; i < liker.length; i++) {
                var isLike = 0;
                if (liker[i] == ress.data) {//已经点过赞了
                  isLike = 1;
                  that.setData({
                    agree: isLike
                  })
                  break;
                }

              }
              that.commentQuery(result[0]);//查询评论
            }).catch(error => {
              that.setData({
                loading: true
              })
              console.log(error)
            })
          }

        }
      })
    }
  },
  //显示内容
  onShow: function () {
  },
  //查询评论
  commentQuery: function (mood) {
    var that=this;
    //console.log(mood.objectId);
    // 查询评论
    var commentlist1 = new Array();
    //var Comments = Bmob.Object.extend("Comments");
    //var queryComment = new Bmob.Query(Comments);
    const queryComment =wx.Bmob.Query('Comments');//评论表
    queryComment.equalTo("mood",'==', mood.objectId);//查询该心情的评论
    queryComment.include("publisher");
    queryComment.order("-createdAt");
    queryComment.find().then(result =>{
      //console.log("评论内容");
      //console.log(result);
      for (var i = 0; i < result.length; i++) {
        var id = result[i].objectId;
        var pid = result[i].olderComment;//关联的评论表
        var uid = result[i].publisher.objectId;
        var content = result[i].content;
        var created_at = result[i].createdAt;
        var olderUserName;
        var userPic = result[i].publisher.userPic;
        var nickname = result[i].publisher.nickName;
        if (pid) {
          pid = pid.objectId;
          olderUserName = result[i].olderUserName;
        }
        else {
          pid = 0;
          olderUserName = "";
        }
        var jsonA;
        jsonA = '{"id":"' + id + '","content":"' + content + '","pid":"' + pid + '","uid":"' + uid + '","created_at":"' + created_at + '","pusername":"' + olderUserName + '","username":"' + nickname + '","avatar":"' + userPic + '"}';
        var jsonB = JSON.parse(jsonA);
        //console.log(jsonB);
        commentlist1.push(jsonB)
        that.setData({
          commentList: commentlist1,
          loading: true
        })
      }
      //console.log("评论结果");
      //console.log(result);
      //console.log("列表");
      //console.log(commentlist1);
    }).catch(error =>{
      
      console.log(error)
    })

  },
  //分享
  onShareAppMessage: function () {
    var that=this;
      return {
        title: that.data.listTitle,
        desc: that.data.listContent,
        path: '/pages/xiaoyouquan/listDetail/listDetail?moodId=' + optionId,
      }
  },
  //点赞
  changeLike: function (event) {//点赞
    var that=this;
    var isLike = that.data.agree
    var likeNum = parseInt(this.data.agreeNum)
   // console.log(likeNum);
    //console.log(isLike);
    if (isLike == "0") {
      likeNum = likeNum + 1;
      that.setData({
        agree: 1,
        agreeNum: likeNum
      })
    }
    else if (isLike == "1") {

      likeNum = likeNum - 1;
      that.setData({
        agree: 0,
        agreeNum: likeNum
      })
    }
    wx.getStorage({
      key: 'objectId',
      success: function (ress) {
        const queryLike =wx.Bmob.Query("Diary");
        //queryLike.equalTo("objectId",'==', optionId);
        //queryLike.find().then(result =>{
          queryLike.get(optionId).then(result=>{
          //console.log(result);
          var likerArray = result.liker;
          var isLiked = false;
          //console.log(likerArray);
          if (likerArray.length > 0) {
            for (var i = 0; i < likerArray.length; i++) {
              if (likerArray[i] == ress.data) {
                likerArray.splice(i, 1);
                isLiked = true;
                result.set('liker',likerArray);
                result.increment('likeNum',-1);
                result.save();
                break;
              }
            }
            if (isLiked == false) {
              likerArray.push(ress.data);
              result.increment('likeNum');
              result.save();
            }
          }
          else {
            likerArray.push(ress.data);
            result.set('liker',likerArray);
            result.increment('likeNum');
            result.save();
          }
          //result[0].save();
        }).catch(error =>{
          console.log(error)
        })
      }
    })
  },
  changeComment: function () {
    var that=this;
    that.setData({
      autoFo: true
    })
  },
  changeFocus: function () {
    var that = this;
    that.setData({
      autoFo: true
    })
  },
  toResponse: function (event) {//去回复
    var that = this;
    var commentId = event.target.dataset.id;
    var userId = event.target.dataset.uid;
    var name = event.target.dataset.name;
    if (!name) {
      name = "";
    }
    if (userId == wx.getStorageSync('objectId')) {
      wx.showToast({
        title: '不能评论自己',
        icon: '',
        image: '',
        duration: 0,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    else {
      var toggleResponse;
      if (that.data.isToResponse == "true") {
        toggleResponse = false;
      }
      else {
        toggleResponse = true;
      }
      that.setData({
        pid: commentId,
        isToResponse: toggleResponse,
        plaContent: "回复" + name + ":",
        resopneName: name
      })
    }

  },
  hiddenResponse: function () {
    var that = this;
    that.setData({
      isToResponse: false
    })
  },
  deleteThis: function () {//删除心情
    var that = this;
    wx.showModal({
      title: '是否删除该心情？',
      content: '删除后将不能恢复',
      showCancel: true,
      confirmColor: "#a07c52",
      cancelColor: "#646464",
      success: function (res) {
        if (res.confirm) {
          // 删除此心情后返回上一页
          //var Diary = Bmob.Object.extend("Diary");
          //var queryDiary = new Bmob.Query(Diary);
          const queryDiary = wx.Bmob.Query('Diary');
          queryDiary.get(optionId).then(result =>{
            //queryDiary.destroy(optionId).then(myObject=>{//直接删除
            result.set('is_hide','1');
            result.save();
            that.dataLoading("删除成功", "success", function () {
                wx.navigateBack({
                  delta: 1
                })
            })
            //})
          }).catch(error =>{
            console.log(error);
          })

        }
        else {
        }
      }
    })
  },
  publicThis: function () {//修改心情公开
    var that = this;
    var isp = this.data.isPublic;
    var title, content, modifyMood;
    var hide;
    if (isp == true) {
      title = "退回心情";
      content = "确定要将该心情退回吗？（退回的心情将在信箱模块消失，不再显示）";
      hide = "0";

    }
    else {
      title = "邮寄心情";
      content = "确定要将该心情邮寄出去吗？（邮寄出去的心情将在信箱模块显示，任何人都可看到）";
      hide = "1";
    }
    modifyMood = function () {
      //var Diary = Bmob.Object.extend("Diary");
      //var query = new Bmob.Query(Diary);
      const query =wx.Bmob.Query('Diary');
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(optionId).then(mood =>{
        mood.set('is_hide', hide);
        mood.save();
      })
    }
    wx.showModal({//模态窗口显示隐藏切换
      title: title,
      content: content,
      showCancel: true,
      confirmColor: "#a07c52",
      cancelColor: "#646464",
      success: function (res) {
        if (res.confirm) {
          modifyMood();
          that.setData({
            isPublic: !isp
          })
        }

      }
    })
  },
  publishComment: function (e) {//评论心情
    var that = this;
    if (e.detail.value.commContent == "") {
      that.dataLoading("评论内容不能为空", "loading");
    }
    else {
      that.setData({
        isdisabled: true,
        commentLoading: true
      })


      wx.getStorage({
        key: 'objectId',
        success: function (ress) {
          that.setData({
            commentLoading: false
          })
          const queryUser=wx.Bmob.Query('_User');
          queryUser.get(ress.data).then(userObject =>{
            const pointer = wx.Bmob.Pointer('_User');
            const poiID = pointer.set(ress.data);
            const pointer1 = wx.Bmob.Pointer('Diary');
            const diary = pointer1.set(optionId);
            const comment =wx.Bmob.Query('Comments');
            comment.set("publisher", poiID);
            comment.set("mood", diary);
            comment.set("content", e.detail.value.commContent);
            if (that.data.isToResponse) {
              var olderName = that.data.resopneName;
              const pointer2 = wx.Bmob.Pointer('Comments');
              const comment1 = pointer2.set(that.data.pid);
              //comment1.id = that.data.pid;
              comment.set("olderUserName", olderName);
              comment.set("olderComment", comment1);
            }
            comment.save().then(res =>{
              const queryDiary = wx.Bmob.Query("Diary");
              queryDiary.get(optionId).then(res => {
                //console.log(optionId);
                res.set('commentNum', res.commentNum + 1);
                res.save();
                var value;
                var my_username;
                const user = wx.Bmob.Query('_User');
                user.get(ress.data).then(r => {
                  value = r.userPic;
                  my_username = r.nickName;
                 // console.log(r);
                })
                const pointer = wx.Bmob.Pointer('_User');
                const isme = pointer.set(ress.data);
                const reply = wx.Bmob.Query('reply');
                reply.set("behavior", 3);
                reply.set("avatar", value);
                reply.set("username", my_username);
                reply.set("uid", isme);
                reply.set("wid", optionId);
                reply.set("fid", that.data.objectIds);
                reply.set("is_read", 0);
                reply.save().then(result => {

                })
                that.onShow();

              })
              that.setData({
                publishContent: "",
                isToResponse: false,
                responeContent: "",
                isdisabled: false,
                commentLoading: false
              })
            }).catch(error =>{
              //common.dataLoading(error, "loading");
              that.setData({
                publishContent: "",
                isToResponse: false,
                responeContent: "",
                isdisabled: false,
                commentLoading: false
              })
            })
            //添加数据，第一个入口参数是null
          }).catch(error =>{

          })

        }
      })

    }
  },
  bindKeyInput: function (e) {
    var that = this;
    that.setData({
      publishContent: e.detail.value
    })
  },
  onHide: function () {
    // Do something when hide.
  },
  onUnload: function (event) {

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  seeBig: function () {
    var that =this;
    wx.previewImage({
      current: that.data.listPic, // 当前显示图片的http链接
      urls: [that.data.listPic] // 需要预览的图片http链接列表
    })
  },

  // 加载框
  dataLoading:function(txt, icon, fun){
    wx.showToast({
      title: txt,
      icon: icon,
      duration: 500,
      success: fun
    })
  }
})
