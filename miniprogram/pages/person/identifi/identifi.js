// pages/identifi/identifi.js
const db=wx.cloud.database().collection('rescue')
const app=getApp()
let rescue_name=''
let rescue_num=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
       fileID:"",
       list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

   let openid=app.globalData.userInfo.openid
    console.log("用户openid为",openid)
    db.where({_openid:openid}).get()
    .then(res=>{
      // console.log(res.data[0])
      let list=res.data[0]
      this.setData({
      list:list
       }) 
    })
    .catch(err=>{

    })
   
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
  getRescueName(e){
    rescue_name=e.detail.value
   },
   getRescueNum(e){
    rescue_num=e.detail.value
   },

   //选取图片
   chooseImg(){
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
  uploadImg(temFilePath,type){
    console.log("调用函数成功")
    let int_num=this.data.num
    let string_num=String(int_num)
    wx.cloud.uploadFile({
      cloudPath: Date.parse(new Date())+'.'+type, 
      filePath: temFilePath, 
      success: res => {
        console.log("上传图片成功")
        this.setData({
          num:int_num+1,
          fileID:res.fileID
        })
       
      },
      fail: console.error
    })
    },

    //插入救援队信息
    addRescueMessage(){
        console.log('图片fileID为',this.data.fileID)
        const doc ={
          rescue_name:rescue_name,
          fileID:this.data.fileID,
          rescue_num:rescue_num
        }
        db.add({
          data:doc,
        })
        .then(res =>{
          console.log('插入Rescue成功',res)

          wx.showToast({
          title: '添加成功',
          duration: 150000
        })
        var timeout=setTimeout(() => {
          wx.reLaunch({
            url: '/pages/person/personal/personal',
          })
        }, 300);
        })
        .catch(res =>{
          console.log('插入Rescue失败',res)
          wx.hideLoading()
        })
    }

})