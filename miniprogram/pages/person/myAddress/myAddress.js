// pages/person/myAddress/myAddress.js
const db = wx.cloud.database().collection('user')
const app=getApp()
let address=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //   db.where({openid:app.globalData.userInfo.openid})
  //   .get()
  //   .then(res=>{
  //     console.log("查询地址成功",res.data) 
  // //     
  //    this.setData({
  //     list:res.data[0]
  //    }) 
  
  //   })
  //   .catch(err=>{
  //     console.log("查询地址失败",err) 
  //   })
    
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

    db.where({openid:app.globalData.userInfo.openid})
    .get()
    .then(res=>{
      console.log("查询地址成功",res.data) 
  //     
     this.setData({
      list:res.data[0]
     }) 
  
    })
    .catch(err=>{
      console.log("查询地址失败",err) 
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

  getAddress(e){
    address=e.detail.value
   },

   addAddress(){

    if(address){

      db.where({openid:app.globalData.userInfo.openid})
      .update({
        data:{
          Address:address
        }
      })
      .then(res=>{

        console.log("添加常用地址成功")
        wx.showToast({
          title: '添加地址成功',
          duration: 150000
        })
        var timeout=setTimeout(() => {
          wx.reLaunch({
            url: '/pages/person/myInfoControl/myInfoControl',
          })
        }, 300);

      })
      .catch(err=>{

      })
    }
    else{

      wx.showToast({
        // 弹窗类型为错误，默认为空，none是无
        icon:"error",
        title: '常用为空',
      })
    }
   }
})