// pages/myInfo/myInfo.js
const db = wx.cloud.database().collection('user')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    list:[],
    isloggin:false,
    idloggin:false,
    userphoto:'',
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let userphoto=app.globalData.userInfo.userphoto
   let isloggin=app.globalData.isloggin
  //  console.log(isloggin)
  //  console.log(userphoto)
   this.setData({
     userphoto:userphoto,
     isloggin:isloggin
   })
   let openid=app.globalData.userInfo.openid
    db.where({openid:openid}).get()
    .then(res=>{

      console.log(res.data[0])

      if(res.data[0].Name){
        this.setData({
          list:res.data[0] ,
          idloggin:true
        })

      }
      app.globalData.idloggin=this.data.idloggin
      console.log("全局认证状态为",app.globalData.idloggin)

    })
    .catch(err=>{

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

  }
})