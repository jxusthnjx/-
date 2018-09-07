var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tilist:[],//题库
    currentid:0,//当前题目id,用来显示当前题目
    count:0,//题目总数
    lastX: 0,          //滑动开始x轴位置
    lastY: 0,          //滑动开始y轴位置
    currentGesture: 0, //标识手势,1向左滑动，2向右滑动
    loading:false,
    iscollect:false,//该题是否收藏了
    collectid:'',//题目收藏的id,取消收藏时要用
    //当前题目内容
    objectid:'',
    titype:'',
    chapter:'',
    level:'',
    content:'',
    contentimg:'',
    picture:'',
    optionsa:'',
    optionsaimg:'',
    optionsb:'',
    optionsbimg:'',
    optionsc:'',
    optionscimg:'',
    optionsd:'',
    optionsdimg:'',
    optionse:'',
    optionseimg:'',
    optionsf:'',
    optionsfimg:'',
    necessary:false,
    answer:'',
    tip:'',

  },

getCollect:function(){
  var that = this;
  var p =new Promise(function(resolve,reject){
    var userid = wx.getStorageSync('objectId');
    var d = that.data.tilist;
    var n = 0;
    const query = wx.Bmob.Query('subject_Collection');
    query.equalTo('userid', '==', userid);
    //query.limit(1000);
    query.find().then(res => {//查询收藏表信息
      const paper = wx.Bmob.Query('paper');
      n = res.length;
      for (var i = 0; i < res.length; i++) {//循环查询题目信  
        paper.get(res[i].paperid).then(r => {
          d.push(r);
        }).catch(err => {
          console.log(err)
        })
      }

      
    })
    query.count().then(r=>{
      that.setData({
        count:r
      })
    })
    resolve(d);

  })
  //console.log(p);
  return p;

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //如果是收藏本
    if(options.objectId=='9'){
      wx.getStorage({
        key: 'objectId',
        success: function(res) {
          that.getCollect().then(function (data) {
            //console.log(data);
            setTimeout(function () {
              that.setData({
                tilist: data
                //count: n
              })
              that.ti(0);
              that.setData({
                loading: true
              })
            }, 2000)

          })
        },
        fail:function(res){
          wx.showModal({
            title: '提示',
            content: '你未登陆,现在登陆吗?',
            success:function(res){
              if(res.confirm){
                wx.redirectTo({
                  url: '../../Login/login',
                })
              }else if(res.cancel){
                wx.switchTab({
                  url: '../index',
                })
              }
            }
          })
        }
      })

    }else if(options.objectId=='100'){//如果是考试的错题
        that.data.tilist=app.globalData.error;
        that.setData({
          loading:true,
          count:app.globalData.error.length
        })
        that.ti(0);
    }else{
      const query = wx.Bmob.Query('paper');
      query.equalTo('courseid', '==', options.objectId);
      query.limit(1000);
      query.find().then(res => {
        //console.log(res);
        that.setData({
          tilist: res
        })
        that.ti(0);
        that.setData({
          loading: true
        })
      })
      query.count().then(res => {
        that.setData({
          count: res
        })
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
    
  },

//题目处理函数，将题目信息传过来，对它进行设置
  ti:function(e){
    var that = this;
    //console.log(that.data.tilist);
    if(!!that.data.tilist){

      //要先清空数据，
      that.setData({
        iscollect: false,
        collectid: '',
        objectid: '',
        titype: '',
        chapter: '',
        level: '',
        content: '',
        contentimg: '',
        picture: '',
        optionsa: '',
        optionsaimg: '',
        optionsb: '',
        optionsbimg: '',
        optionsc: '',
        optionscimg: '',
        optionsd: '',
        optionsdimg: '',
        optionse: '',
        optionseimg: '',
        optionsf: '',
        optionsfimg: '',
        necessary: false,
        answer: '',
        tip: ''
      })
      //转换
      var n = e - 0;//题目的id，-0表示转换为数字类型
      if (!!that.data.tilist[n].objectId) {
        that.setData({
          objectid: that.data.tilist[n].objectId
        })
      }
      //console.log(that.data.tilist[n].Necessary);
      if (!!that.data.tilist[n].Type) {
        that.setData({
          titype: that.data.tilist[n].Type
        })
      }
      if (!!that.data.tilist[n].Chapter) {
        that.setData({
          chapter: that.data.tilist[n].Chapter
        })
      }
      if (!!that.data.tilist[n].level) {
        that.setData({
          level: that.data.tilist[n].level
        })
      }
      if (!!that.data.tilist[n].Picture) {
        that.setData({
          picture: that.data.tilist[n].Picture
        })
      }
      //判断题目内容是否是图片
      if (that.data.tilist[n].Content.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.tilist[n].Content;
        var str = s.substring(1, s.length);
        that.setData({
          contentimg: str
        })
      } else {
        that.setData({
          content: that.data.tilist[n].Content
        })
      }

      //判断选项是否有图片
      if (that.data.tilist[n].OptionsA.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.tilist[n].OptionsA;
        var str = s.substring(1, s.length);
        that.setData({
          optionsaimg: str
        })
      } else {
        that.setData({
          optionsa: that.data.tilist[n].OptionsA
        })
      }
      if (that.data.tilist[n].OptionsB.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.tilist[n].OptionsB;
        var str = s.substring(1, s.length);
        that.setData({
          optionsbimg: str
        })
      } else {
        that.setData({
          optionsb: that.data.tilist[n].OptionsB
        })
      }
      if (that.data.tilist[n].OptionsC.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.tilist[n].OptionsC;
        var str = s.substring(1, s.length);
        that.setData({
          optionscimg: str
        })
      } else {
        that.setData({
          optionsc: that.data.tilist[n].OptionsC
        })
      }
      if (that.data.tilist[n].OptionsD.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.tilist[n].OptionsD;
        var str = s.substring(1, s.length);
        that.setData({
          optionsdimg: str
        })
      } else {
        that.setData({
          optionsd: that.data.tilist[n].OptionsD
        })
      }
      if (that.data.tilist[n].OptionsE.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.tilist[n].OptionsE;
        var str = s.substring(1, s.length);
        that.setData({
          optionseimg: str
        })
      } else {
        that.setData({
          optionse: that.data.tilist[n].OptionsE
        })
      }
      if (that.data.tilist[n].OptionsF.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.tilist[n].OptionsF;
        var str = s.substring(1, s.length);
        that.setData({
          optionsfimg: str
        })
      } else {
        that.setData({
          optionsf: that.data.tilist[n].OptionsF
        })
      }
      //必考
      if (!!that.data.tilist[n].Necessary) {
        that.setData({
          necessary: true
        })
      } else {
        that.setData({
          necessary: false
        })
      }

      //答案
      if (!!that.data.tilist[n].Answer) {
        that.setData({
          answer: that.data.tilist[n].Answer
        })
      }
      //解析
      if (!!that.data.tilist[n].tip) {
        that.setData({
          tip: that.data.tilist[n].tip
        })
      }
      //判断是否收藏了该题
      var userid = wx.getStorageSync('objectId');
      const query = wx.Bmob.Query('subject_Collection');
      query.equalTo('userid', '==', userid);
      query.equalTo('paperid', '==', that.data.objectid);
      query.find().then(res => {
       // console.log(res);
        if (res.length) {
          that.setData({
            iscollect: true,
            collectid: res[0].objectId
          })
        } else {
          that.setData({
            iscollect: false
          })
        }

      })
    }
  },

  //滑动移动事件
handletouchmove: function(event) {
  var that =this;
  var currentX = event.touches[0].pageX
  var currentY = event.touches[0].pageY
  var tx = currentX - that.data.lastX
  var ty = currentY - that.data.lastY
  //左右方向滑动
  if (Math.abs(tx) > Math.abs(ty)) {
    if (tx < 0){
      if(that.data.currentid>=that.data.count -1){
        wx.showToast({
          title: '已经是最后一题了！',
        })
      }
      else{
        //var num = that.data.currentid + 1;
        that.setData({
          currentGesture:1
        })
      }
    }
      //text = "向左滑动"
    else if (tx > 0){
      if(that.data.currentid>0){
        //var num =that.data.currentid-1;
        that.setData({
          currentGesture:2
        })
      }
    }
      //text = "向右滑动"
  }
//将当前坐标进行保存以进行下一次计算
  that.data.lastX = currentX
  that.data.lastY = currentY
},

  //滑动开始事件
handletouchstart: function(event) {
  var that = this;
  that.data.lastX = event.touches[0].pageX
  that.data.lastY = event.touches[0].pageY
  },
//滑动结束事件
handletouchend: function (event) {
  var that =this;
  if (that.data.currentGesture==1){
    var num = that.data.currentid + 1;
    that.ti(num);//调用函数，对题目内容进行解析
    that.setData({
      currentid:num,
      currentGesture:0
    })

  } else if (that.data.currentGesture == 2){
    var num = that.data.currentid - 1;
    that.ti(num);
    that.setData({
      currentid: num,
      currentGesture: 0
    })
  }
  
  },
//图片预览
  seeBig: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.urls, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.urls], // 需要预览的图片http链接列表
      fail:function(res){
        console.log(res)
      }
    })
  },
  //题目收藏
  collectList:function(e){
    var that=this;
    var userid=wx.getStorage({
      key: 'objectId',
      success: function(res) {
          if (that.data.iscollect) {
            const query = wx.Bmob.Query('subject_Collection');
            query.destroy(that.data.collectid).then(res => {
              wx.showToast({
                title: '已取消收藏',
              })
              that.setData({
                iscollect: false
              })
            })
          } else {
            var userid = wx.getStorageSync('objectId');
            const query = wx.Bmob.Query('subject_Collection');
            query.set('userid', userid);
            query.set('paperid', that.data.objectid);
            query.save().then(res => {
              wx.showToast({
                title: '收藏成功!',
              })
              that.setData({
                iscollect: true
              })
            })
          }
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          content: '未登录,请先登陆',
          success:function(res){
            if(res.confirm){
              wx.redirectTo({
                url: '../../Login/login',
              })
            }
          }
        })

      }
    })

  }
})