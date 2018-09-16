//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
   userInfo:{},
   subject:'',//科目名称，用于显示
   courseid:'',//科目id，保存成绩要用
   score:'',//得分
  },
  gotoWDCT(){
    if(app.globalData.error.length > 0){
        wx.redirectTo({
          url: `../answer_info/answer_info?objectId=100`
        })
    }else{
      wx.showModal({
        title:'提示',
        content: '恭喜您，暂无错题。即将返回首页！',
        showCancel:false,
        confirmText:'知道了',
        confirmColor:'#00bcd5',
        success: function(res) {
          
          wx.switchTab({
            url: '../../index/index',
          })
        }
      })
    }
  },

  onLoad (params) {
    var that =this;
    var date =new Date();
    var today=date.getFullYear()+'年'+parseInt(date.getMonth()+1)+'月'+date.getDate()+'日'+date.getHours()+'时'+date.getMinutes()+'分'
    
    that.setData({
      subject:params.subject,
      score: params.score,
      courseid:params.courseid,
      date:today
    })
    var user = wx.getStorageSync('objectId');
    const users = wx.Bmob.Query('_User');
    users.get(user).then(res => {
      // console.log(res);
      that.setData({
        userInfo: res

      })
    })
    //记录成绩
    const query =wx.Bmob.Query('course');
    query.get(params.courseid).then(res=>{
      if(res.isscore){
        if(res.score<=params.score-0){
          const q=wx.Bmob.Query('user_score');
          q.set('username',that.data.userInfo.username);
          q.set('studentname',that.data.userInfo.studentname);
          q.set('courseid',params.courseid);
          q.set('coursename',params.subject);
          q.set('score',params.score-0);
          q.save().then(res=>{

          })
        }
      }
    })

    
  },
  onShareAppMessage: function () {
    return {
      title: `我在华南技校题库小程序考了${this.data.score}分，等你来挑战.....`,
      desc: '华南技校题库小程序,大家都在使用',
      path: '/pages/index/index'
    }
  }
});