// pages/help/publish_need/publish_need.js
const db = wx.cloud.database().collection('needhelp')
// 引入SDK核心类
var QQMapWX=require('../../utils/qqmap-wx-jssdk.js')
// 实例化API核心类
const wxMap = new QQMapWX({
  key: 'E2NBZ-2UCCU-HTNV3-BOLYI-5ERXE-5EBRZ'
});

// var qqmapsdk;
const app=getApp()
let need_tele=''
let need_message=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ischooseposition:false,
    //1为选择器，2为文本框
    addresstype:1,
    region: ['全部', '全部', '全部'],
    customItem: '全部',
    choose:1,
    textMessage:"",
    textcssid:1,
    videocssid:1,
    numberDataShow:false,
    openid:'',
    wxtelephone:'',
    //下面都是语音输入的data
    luStatu:false,
    list:[],
    width:0,
    address:''
    

  },
  //地区选择器
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ischooseposition:true,
      region: e.detail.value
    })
  },
  //选择文字输入
  choosetextMessage:function(){
   this.setData({
     choose:1,
     textcssid:1,
     videocssid:1,
   })
  },
   //选择语音输入
   choosevideoMessage(e){
     console.log(e)
     console.log(Page)
    this.setData({
      choose:2,
      videocssid:2,
      textcssid:2
    })
  },

  //不用管这个
sendPicture:function(){
this.setData({
  numberDataShow:true
})

  },

  //发送图片
  chooseImg(){
    this.setData({
      numberDataShow:false
    })

    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res=> {
        console.log("选取图片成功")
        //console.log("当前页面",this)
        var that=this
        let temFilePaths=res.tempFilePaths
        temFilePaths.forEach(function(item,index){
        wx.getImageInfo({
          src: item,
          success:res=> {
            var type=res.type
            console.log("类型获取成功",type)
            console.log(that)
            that.uploadImg(item,type)
          }
        })
        })
      }
    }) 

  },

//上传文件
uploadImg(temFilePath,type){
  // console.log("调用函数成功")
  let int_num=this.data.num
  let string_num=String(int_num)
  wx.cloud.uploadFile({
    cloudPath: Date.parse(new Date())+'.'+type, 
    filePath: temFilePath, 
    success: res => {
      console.log("上传图片成功")
      this.setData({
        num:int_num+1
      })
      wx.showToast({
        title: '图片上传成功',
        duration: 1500
      })
      
    
    },
    fail: console.error
  })
  },








  //发送文件
  chooseFile(){
    this.setData({
      numberDataShow:false
    })

    wx.chooseMessageFile({
      count: 1,
      type:"all",
      success:res=>{
        wx.showToast({
          title: '文件上传成功',
          duration: 1500
        })
        let tempFile=res.tempFiles[0]
        this.uploadFile(tempFile.name,tempFile.path,tempFile.type)
      },
     
    })
  },

  uploadFile(name,tempUrl,type){
    wx.cloud.uploadFile({
      cloudPath: name, 
      filePath:tempUrl,
      success:res=>{
        console.log("文件上传成功")
        // let fileID=res.fileID
        
      },
      fail: console.error
    })
  },






  //选择求救常用语
  textMessageAdd:function(e){
   var data=e.currentTarget.dataset.hi
    var textMessage=this.data.textMessage
    var massa=textMessage+data+","
    this.setData({
      textMessage:massa
    })
    console.log(massa)
  },

 //提交表单
 submit(){

  //插入数据
  if(need_tele&&this.data.region){

    db.add({
      data:{
       NeedTelephone:need_tele,
      //  NeedWXTelephone:this.data.wxtelephone,
       NeedMessage:need_message,
      //选择器地址，数组
       NeedAddress:this.data.region,
       NeedTextMessage:this.data.textMessage,
       //定位地址，string
       NeedPresentAddress:this.data.address      
      }
    })
    .then(res=>{
      console.log("添加成功",res)

      //改变用户状态为求助态 2
      wx.cloud.database().collection('user').where({openid:this.data.openid})
      .update({
        data:{
          state:2
        }
      })
      .then(res=>{
        console.log("用户状态修改成功",res)

        wx.navigateTo({
          url: '/pages/help/need_wait/need_wait'
        })
      })
      .catch(err=>{
        console.log("用户状态修改失败",err)
      })


      //删除offerhelp表内记录
      wx.cloud.database().collection('offerhelp')
      .where({
        _openid:this.data.openid
      }).remove()
      .then(res=>{

      })
      .catch(err=>{
        
      })

      //删除offerhelpmakers表内坐标记录
      wx.cloud.database().collection('offerhelpmakers')
      .where({
        _openid:this.data.openid
      }).remove()
      .then(res=>{

      })
      .catch(err=>{
        
      })
      
    })
    .catch(err=>{
      console.log("添加失败",err)
    })
   }
  // wx.navigateTo({
  //   url: '/pages/help/need_wait/need_wait'
  // })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
  },

  //获取地址
  getLocation(){

   var that=this
    wx.getLocation({
      success: (res) => {
        let latitude = res.latitude
        let longitude = res.longitude
        that.setData({
          addresstype:2
        })
        wxMap.reverseGeocoder({
          location:{
            latitude:latitude,
            longitude:longitude
          },
          success:function(res){
            //得到详细对象
            let result=res.result
            console.log(res.result.address)
            that.setData({
              address:res.result.address
            })
            // //从省份到县城再到某一路的位置信息
            // let address=result.address
            // //将上面信息变成JSON对象
            // let addressComponent= result.address_component
            // //国家
            // let nation=addressComponent.nation
            // //省份
            // let province=addressComponent.province
            // //市级单位
            // let city=addressComponent.city
            // //县级别单位
            // let district=addressComponent.district
          }
        })
      },
 
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  //下面都是语音输入
  /**
   * 生命周期函数--监听页面显示
   */
  // 实时监测变化调用这些方法
  onShow:function(){

    let openid=app.globalData.userInfo.openid
    this.setData({
      openid:openid
    })

    // console.log(this.data.openid)


    var that=this;
    //  初始化录音对象
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function () {
    that.tip("录音失败！")
    });
    
    // 录音结束
    this.recorderManager.onStop(function (res) {
    var list=that.data.list;
    var width = that.data.width;
    var src = res.tempFilePath;
    console.log('list的1是',list)
    // console.log(src)
    var aa={
    src: src,
    width: width,
    play:false
    }
    list.push(aa);
    console.log('list的2是', list)
    that.setData({
    list: list
    })
    
    // that.tip("录音完成！")
    //console.log(list)
    });
    
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
    that.tip("播放录音失败！")
    })
    },
  // 触摸开始
touchStart:function(e){
  // console.log('touchStart', e);
  var start=e.timeStamp;
  var seconds = (start % (1000 * 60)) / 1000;
  this.setData({
  start: seconds,
  luStatu:true,
  })
  this.recorderManager.start({
  format: 'mp3'
  });
  },
  
  // 触摸结束
  touchEnd:function (e) {
  // console.log('touchEnd', e);
  var start = this.data.start;
  var end = e.timeStamp;
  var seconds = (end % (1000 * 60)) / 1000;
  var shijian = seconds - start;
  var width = shijian*4;
  this.setData({
  end: seconds,
  shijian: shijian,
  luStatu: false,
  width: width
  })
  this.recorderManager.stop();
  console.log('按了' + shijian+'秒');
  console.log('width是',width);
  },
  
  tip: function (msg) {
    wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false
    })
    },
    
    // 播放录音
    audioPlay: function (e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    console.log(src)
    if (src == '') {
    this.tip("失效")
    return;
    }
    this.innerAudioContext.src = src;
    this.innerAudioContext.play();
    },
    deleteVoice:function(e){
    var that = this, num = e.currentTarget.dataset.index, o = that.data.list;
    wx.showModal({
    title: "提示",
    content: "确认要删除该语音吗?",
    success: function(e) {
      if (e.confirm) console.log("点击确定了"), o.splice(num, 1); else if (e.cancel) return console.log("点击取消了"), 
      !1;
      that.setData({
          list: o
      });
    }
    });        
    },


    getNeedTele(e){
      need_tele=e.detail.value
      // console.log(need_tele)
     },

  getNeedMessage(e){

    need_message=e.detail.value
  
    // console.log(e.detail.value)
   },
   getWXTele(){
     wx.cloud.database().collection('user')
     .where({openid:this.data.openid})
     .get()
     .then(res=>{

      console.log("微信电话为",res.data[0].Telephone)
      this.setData({
        wxtelephone:res.data[0].Telephone
      })
      need_tele=res.data[0].Telephone
     })
     .catch(err=>{

     })
   }
})