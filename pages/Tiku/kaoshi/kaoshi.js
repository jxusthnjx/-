var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //考试确认界面
    userInfo: {},//考生信息,姓名studentname,头像:userPic,班级:userclass,专业:userprofession
    kaoshitime:0,//总共考试时间
    starttime:0,//已经考了多少时间
    time:"00:00",//时间显示
    swipertime:'',
    hidenquren:false,//是否隐藏考试确认界面
    hidenkaoshi:true,//是否隐藏考试界面

    courseid:'',//课程id
    coursename:'',//试卷名称
    tilist: [],//该科目所有题目
    kaoshiti:[],//筛选出符合条件的题目.随机选取
    totalscore:0,//总分
    kaoshianswer:[],//考生的答案
    errorti:[],//错题
    alltype:[],//科目所有题目类型,不重复
    numscore:[],//考试题目数量和分值
    currentid: 0,//当前题目id,用来显示当前题目
    count: 0,//所有题目总数
    ticount:0,//考试题目总数
    currentGesture: 0, //标识手势,1向左滑动，2向右滑动
    loading: true,
    //当前题目内容
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
    tip: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var obj = wx.getStorage({
      key: 'objectId',
      success: function (res) {
        
          that.setData({
            courseid: options.objectId,
          })
          that.getInfo();
          that.tiInfo();
        
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          content: '你未登陆,现在登陆?',
          success:function(r){
            if(r.confirm){
              wx.navigateTo({
                url: '../../Login/login',
              })
            }else if(r.cancel){
              wx.switchTab({
                url: '../index',
              })
            }
          }
        })
      }
    })


    //that.randTi();
  },
  
//获取用户信息,考试时间等信息
  getInfo:function(){
    var that=this;
    var user = wx.getStorageSync('objectId');
    const users = wx.Bmob.Query('_User');
    users.get(user).then(res => {
     // console.log(res);
      that.setData({
        userInfo: res
      })
    })
    const query = wx.Bmob.Query('sysinfo');
    query.equalTo('name', '==', that.data.courseid);
    query.find().then(res => {
      //console.log(res);
      that.setData({
        kaoshitime: res[0].numinfo
      })
    })

  },
//考试确认框信息
  queren:function(){
    var that=this;
    wx.getStorage({
      key: 'objectId',
      success: function(res) {
        var time = new Date().getTime();//获取开始考试时间戳
        that.setData({
          hidenquren: true,
          hidenkaoshi: false,
          starttime: time
        })
        that.randTi();
        that.ti(0);
        that.getTime();
      },
      fail:function(){
        wx.switchTab({
          url: '../index',
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
    clearInterval(this.data.swipertime);

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.swipertime);
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
  ti: function (e) {
    var that = this;
    //console.log(that.data.tilist);
    if (!!that.data.kaoshiti) {

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
      if (!!that.data.kaoshiti[n].objectId) {
        that.setData({
          objectid: that.data.kaoshiti[n].objectId
        })
      }
      //console.log(that.data.kaoshiti[n].Necessary);
      if (!!that.data.kaoshiti[n].Type) {
        that.setData({
          titype: that.data.kaoshiti[n].Type
        })
      }
      if (!!that.data.kaoshiti[n].Chapter) {
        that.setData({
          chapter: that.data.kaoshiti[n].Chapter
        })
      }
      if (!!that.data.kaoshiti[n].level) {
        that.setData({
          level: that.data.kaoshiti[n].level
        })
      }
      if (!!that.data.kaoshiti[n].Picture) {
        that.setData({
          picture: that.data.kaoshiti[n].Picture
        })
      }
      //判断题目内容是否是图片
      if (that.data.kaoshiti[n].Content.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.kaoshiti[n].Content;
        var str = s.substring(1, s.length);
        that.setData({
          contentimg: str
        })
      } else {
        that.setData({
          content: that.data.kaoshiti[n].Content
        })
      }

      //判断选项是否有图片
      if (that.data.kaoshiti[n].OptionsA.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.kaoshiti[n].OptionsA;
        var str = s.substring(1, s.length);
        that.setData({
          optionsaimg: str
        })
      } else {
        that.setData({
          optionsa: that.data.kaoshiti[n].OptionsA
        })
      }
      if (that.data.kaoshiti[n].OptionsB.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.kaoshiti[n].OptionsB;
        var str = s.substring(1, s.length);
        that.setData({
          optionsbimg: str
        })
      } else {
        that.setData({
          optionsb: that.data.kaoshiti[n].OptionsB
        })
      }
      if (that.data.kaoshiti[n].OptionsC.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.kaoshiti[n].OptionsC;
        var str = s.substring(1, s.length);
        that.setData({
          optionscimg: str
        })
      } else {
        that.setData({
          optionsc: that.data.kaoshiti[n].OptionsC
        })
      }
      if (that.data.kaoshiti[n].OptionsD.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.kaoshiti[n].OptionsD;
        var str = s.substring(1, s.length);
        that.setData({
          optionsdimg: str
        })
      } else {
        that.setData({
          optionsd: that.data.kaoshiti[n].OptionsD
        })
      }
      if (that.data.kaoshiti[n].OptionsE.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.kaoshiti[n].OptionsE;
        var str = s.substring(1, s.length);
        that.setData({
          optionseimg: str
        })
      } else {
        that.setData({
          optionse: that.data.kaoshiti[n].OptionsE
        })
      }
      if (that.data.kaoshiti[n].OptionsF.charAt(0) == '/') {//斜杆开头的就是图片
        var s = that.data.kaoshiti[n].OptionsF;
        var str = s.substring(1, s.length);
        that.setData({
          optionsfimg: str
        })
      } else {
        that.setData({
          optionsf: that.data.kaoshiti[n].OptionsF
        })
      }
      //必考
      if (!!that.data.kaoshiti[n].Necessary) {
        that.setData({
          necessary: true
        })
      } else {
        that.setData({
          necessary: false
        })
      }

      //答案
      if (!!that.data.kaoshiti[n].Answer) {
        that.setData({
          answer: that.data.kaoshiti[n].Answer
        })
      }
      //解析
      if (!!that.data.kaoshiti[n].tip) {
        that.setData({
          tip: that.data.kaoshiti[n].tip
        })
      }
      //判断是否收藏了该题
    }
  },

  //滑动移动事件
  handletouchmove: function (event) {
    var that = this;
    var currentX = event.touches[0].pageX
    var currentY = event.touches[0].pageY
    var tx = currentX - that.data.lastX
    var ty = currentY - that.data.lastY
    //左右方向滑动
    if (Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0) {
        if (that.data.currentid >= that.data.kaoshiti.length - 1) {
          wx.showToast({
            title: '已经是最后一题了！',
          })
        }
        else {
          //var num = that.data.currentid + 1;
          that.setData({
            currentGesture: 1
          })
        }
      }
      //text = "向左滑动"
      else if (tx > 0) {
        if (that.data.currentid > 0) {
          //var num =that.data.currentid-1;
          that.setData({
            currentGesture: 2
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
  handletouchstart: function (event) {
    var that = this;
    that.data.lastX = event.touches[0].pageX
    that.data.lastY = event.touches[0].pageY
  },
  //滑动结束事件
  handletouchend: function (event) {
    var that = this;
    if (that.data.currentGesture == 1) {
      var num = that.data.currentid + 1;
      that.ti(num);//调用函数，对题目内容进行解析
      that.setData({
        currentid: num,
        currentGesture: 0
      })

    } else if (that.data.currentGesture == 2) {
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
      fail: function (res) {
        console.log(res)
      }
    })
  },
  
  //科目题库信息
  tiInfo:function(){
    var that =this;
    //获取科目名称
    const course=wx.Bmob.Query('course');
    course.equalTo('objectId','==',that.data.courseid);
    course.find().then(res=>{
      that.setData({
        coursename:res[0].title
      })
    })
    //获取科目所有题目
    const query = wx.Bmob.Query('paper');
    query.equalTo('courseid', '==', that.data.courseid);//获取试题
    query.limit(1000);//不加这句只能获取前100题
    query.find().then(res => {
      //console.log(res);
      that.setData({
        tilist: res
      })
    })
    //所有题目总数
    query.count().then(res => {
      that.setData({
        count: res
      })
    })
    //获取科目所有题目类型,在选取数量和分值时要用
    query.statTo('groupby','Type');
    query.find().then(res=>{
      that.setData({
        alltype:res
      })
    })

    //获取考试的题目数量和分值,包含题型,数量,每题分值.
    const examnum = wx.Bmob.Query('ExamNum');
    var score=0;
    examnum.equalTo('courseid','==',that.data.courseid)
    examnum.find().then(res=>{
      for (var i = 0; i < res.length; i++) {
        score += res[i].Num * res[i].score;
      }
      that.setData({
        numscore:res,
        totalscore:score
      })
      


    })

  },

  //随机取题
  randTi:function(){
    var that = this;
    var arr = new Array();//定义一个和该题要出题数量一样大的数组
    //console.log('出题信息'+that.data.numscore);
    for (var i = 0; i < that.data.numscore.length; i++) {
      //console.log(that.data.numscore);
      var typeallti = new Array();//把题库中所有该类型的题号存进去
      for (var j = 0; j < that.data.tilist.length; j++) {
        //判断题型是否一样
        if (that.data.tilist[j].Type == that.data.numscore[i].subject) {
          typeallti.push(that.data.tilist[j]);
        }
      }
      if(that.data.numscore[i].Num>=typeallti.length){//如果要选择的题目大于总题数
        arr=typeallti.concat();
      }else{
        //开始随机选题
        for (var m = that.data.numscore[i].Num; m > 0; m--) {//要选N题
          var t = Math.floor(Math.random() * typeallti.length);//random()生成0-1随机数,乘以总长度就是生成0-lenght的随机数.floor向下取整
          arr.push(typeallti[t]);//将选出的题目添加到临时数组中
          typeallti.splice(t, 1);//将该题从数组中删除,避免选取重复值,注意数组长度会随之改变,不能用delete

        }
      }
    }
    //console.log(arr);
    that.setData({
      kaoshiti: arr
    })
  

  },

//记录学生的选项答案
  xuanxiang:function(e){
    var that=this;
    var answer=that.data.kaoshianswer;
    var daan=e.currentTarget.dataset.daan;
    answer[that.data.currentid]=daan;
    that.setData({
      kaoshianswer:answer
    })
    //console.log(that.data.kaoshianswer);
  },

//交卷按钮
  submitTip:function(){
    var that=this;
    //如果用户还没有答完题目或者还有未答的题目,则弹出对话框.
    if (that.data.kaoshianswer.length < that.data.kaoshiti.length){
      wx.showModal({
        title: '提示',
        content: '你还有未答题目,是否现在交卷?',
        success:function(res){
          if(res.confirm){//用户点了确定
            that.calculationScore();
          }else if(res.cancel){//用户点了取消

          }
        }
      })
    }else{
      var isall=false;
      for (var i = 0; i < that.data.kaoshianswer.length; i++) {
        if (!that.data.kaoshianswer[i]) {
          isall=true;
          break;
        }
      }
      if(isall){
        wx.showModal({
          title: '提示',
          content: '你还有未答题目,是否现在交卷?',
          success: function (res) {
            if (res.confirm) {//用户点了确定
              that.calculationScore();
            } else if (res.cancel) {//用户点了取消

            }
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '你确定现在交卷吗?',
          success: function (res) {
            if (res.confirm) {//用户点了确定
              that.calculationScore();
            } else if (res.cancel) {//用户点了取消
            }
          }
        })
      }

    }
  },
//计算分数
  calculationScore:function(){
    var that =this;
    var totalscore=0;
    var n=0;
    var error =that.data.errorti;
    //遍历所有题型,因为每个题型分数不一样.
    for (var i = 0; i < that.data.numscore.length; i++){
      var num=that.data.numscore[i].Num;//获取该题型的数量
      var score=that.data.numscore[i].score;//获取该题型每题分数
      for(var j=0;j<num;j++){
        if(that.data.kaoshianswer[n]){
          //去掉前后空格
          that.data.kaoshiti[n].Answer = that.data.kaoshiti[n].Answer.replace(/^\s*|\s*$/g, "");
          //转换大写
          that.data.kaoshiti[n].Answer = that.data.kaoshiti[n].Answer.toUpperCase();
          if(that.data.kaoshianswer[n]==that.data.kaoshiti[n].Answer){
            totalscore+=score;
          }else{
            error.push(that.data.kaoshiti[n]);//加入错题数组
          }
        }else{
          if(that.data.kaoshiti[n]){
            error.push(that.data.kaoshiti[n]);//没做的题目也加进错题数组
          }
        }
        n++;
      }
    }
    app.globalData.error=error;
    //console.log(app.globalData.error);
    wx.redirectTo({
      url: '../answer_mark/answer_mark?allscore='+that.data.totalscore+'&score='+totalscore+'&subject='+that.data.coursename,
    })
  },

  //考试时间显示,交卷
  getTime:function(){
    var that =this;
    var currenttime = new Date().getTime();//获取当前时间戳
    var time=currenttime - that.data.starttime;//已经考了多少时间.
    //判断是否到时间
    var isover = that.data.kaoshitime * 60 * 1000-(currenttime - that.data.starttime);
    if(isover>0){
      //转换成分/秒形式.倒计时
      var t = that.data.kaoshitime * 60 * 1000 - time;
      var fen = Math.floor(t / (1000 * 60));
      var miao = Math.floor((t - fen * 60 * 1000) / 1000);

      that.setData({
        time: `${fen > 9 ? fen : '0' + fen}:${miao > 9 ? miao : '0' + miao}`
      })
    }else{//强制交卷
      clearInterval(that.data.swipertime);
      that.data.swipertime='';
      that.calculationScore();
      
    }
    that.data.swipertime =  setTimeout(()=>{that.getTime()},1000);
  }

})