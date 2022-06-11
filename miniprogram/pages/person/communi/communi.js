// pages/person/communi/communi.js
const db = wx.cloud.database().collection('user')
const app=getApp()
let urgent_tele=''
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
  //     console.log("查询紧急联系人电话成功",res.data) 
  // //     
  //    this.setData({
  //     list:res.data[0]
  //    }) 
  
  //   })
  //   .catch(err=>{
  //     console.log("查询紧急联系人电话失败",err) 
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
      console.log("查询紧急联系人电话成功",res.data) 
  //     
     this.setData({
      list:res.data[0]
     }) 
  
    })
    .catch(err=>{
      console.log("查询紧急联系人电话失败",err) 
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
  getUrgentTele(e){
    urgent_tele=e.detail.value
   },
  addUrgentTele(){

    if(urgent_tele){

      db.where({openid:app.globalData.userInfo.openid})
      .update({
        data:{
          Urgent_Telephone:urgent_tele
        }
      })
      .then(res=>{

        console.log("添加紧急联系人电话成功")
        wx.showToast({
          title: '添加联系人成功',
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
        title: '紧急联系人电话为空',
      })
    }
   }
})