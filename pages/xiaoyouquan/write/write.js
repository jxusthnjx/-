//获取应用实例
var app = getApp();

Page({
  data:{
    title:'',
    src:'',
    isSrc:false,
    ishide:"0",
    autoFocus:true,
    isLoading:false,
    loading:true,
    isdisabled:false,
    files:{},

  },

  onLoad: function(options) {
    var that = this;
    that.setData({ //初始化数据
      src: "",
      isSrc: false,
      ishide: "0",
      autoFocus: true,
      isLoading: false,
      loading: true,
      isdisabled: false
    })
    var object =wx.getStorage({
      key: 'objectId',
      success: function(res) {
        if(!res){
          wx.redirectTo({
            url: '../../Login/login',
          })
        }
      },
    })
  },
  onReady: function() {
    wx.hideToast()
  },
  onShow: function() {
    var that = this;
    var myInterval = setInterval(getReturn, 500);

    function getReturn() {
      wx.getStorage({
        key: 'objectId',
        success: function(ress) {
          if (ress.data) {
            clearInterval(myInterval)
            that.setData({
              loading: true
            })
          }
        }
      })
    }
  },
  uploadPic: function() { //选择图标
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          isSrc: true,
          src: tempFilePaths
        })
        //上传文件
        var me = wx.getStorageSync('objectId')
          var name = me + Date.parse(new Date()) + ".jpg"; //上传的图片的别名
          var file = wx.Bmob.File(name, that.data.src[0]);
          file.save().then(res => {
            that.setData({
              files:res
            })
          })

        
      }
    })
  },
  clearPic: function() { //删除图片
    var that = this;
    that.setData({
      isSrc: false,
      src: ""
    })
  },
  changePublic: function(e) { //switch开关
    var that = this;
    console.log(e.detail.value)
    if (e.detail.value == true) {
      wx.showModal({
        title: '邮寄心情',
        content: '确定要将该心情邮寄出去吗？（邮寄出去的心情将在信箱模块显示，任何人都可看到）',
        showCancel: true,
        confirmColor: "#a07c52",
        cancelColor: "#646464",
        success: function(res) {
          if (res.confirm) {
            that.setData({
              ishide: "0"
            })
          } else {
            that.setData({
              isPublic: true
            })
          }
        }
      })

    } else {
      wx.showModal({
        title: '退回心情',
        content: '确定要将该心情退回吗？（退回的心情将在信箱模块消失，不再显示）',
        showCancel: true,
        confirmColor: "#a07c52",
        cancelColor: "#646464",
        success: function(res) {
          if (res.confirm) {
            that.setData({
              ishide: "0"
            })
          } else {
            that.setData({
              isPublic: false
            })
          }
        }
      })

    }
  },
  sendNewMood: function (e) { //保存心情
    //判断心情是否为空

    var content = e.detail.value.content;
    var title = e.detail.value.title;
    var that = this;
    if (content == "") {
      that.dataLoading("心情内容不能为空", "loading");
    } else {
      that.setData({
        isLoading: true,
        isdisabled: true
      })
      const diary = wx.Bmob.Query('Diary');
      const pointer = wx.Bmob.Pointer('_User');
      //me= ress.data;
      var me = wx.getStorageSync('objectId');
      const poiID = pointer.set(me);
      diary.set("title", title);
      diary.set("content", content);
      diary.set("is_hide", "0");
      diary.set("publisher", poiID);
      diary.set("likeNum", 0);
      diary.set("commentNum", 0);
      diary.set("liker", []);
      const fileData=JSON.parse(that.data.files[0]);
      diary.set('pic',fileData);
      console.log(that.data.files);
      console.log(diary);
      //上传数据
      diary.save().then(res => {
        that.setData({
          isLoading: false,
          isdisabled: false
        })
        wx.showToast({
          title: '发布成功!',
        })
        wx.switchTab({
          url: '/pages/xiaoyouquan/mail',
        })
      }).catch(err => {
        wx.showToast({
          title: '发布失败',
        })
        that.setData({
          isLoading: false,
          isdisabled: false
        })

      })
      

      


    }



  },

  //上传图片
  upLoadFile(callBack){
    var that =this;
    //上传图片,异步传输

  },

//保存数据
saveDiary:function(){
  var that =this;
  console.log(diary);

},





  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },

  dataLoading:function(txt, icon, fun){
    wx.showToast({
      title: txt,
      icon: icon,
      duration: 500,
      success: fun
    })
  }
})