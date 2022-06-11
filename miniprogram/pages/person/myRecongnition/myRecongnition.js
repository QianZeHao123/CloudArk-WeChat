// pages/myRecongnition/myRecongnition.js
const db = wx.cloud.database().collection('user')
const app=getApp()
let user_name=""
let user_num=''
let user_pname=''
let user_tele=''
let user_career=''
let user_mail=''
let user_sex=''
let openid=''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['请选择性别', '男', '女'],
    objectArray: [
      {
        id: 0,
        name: '请选择性别'
      },
      {
        id: 1,
        name: '男'
      },
      {
        id: 2,
        name: '女'
      },
     
    ],
    index:0,
    list:[],
    idloggin:false,
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
    openid=app.globalData.userInfo.openid
    let idloggin=app.globalData.idloggin

    console.log("用户openid为",openid)
    this.setData({
      list:app.globalData.userInfo,
      idloggin:idloggin

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

  bindPickerChange: function(e) {
    // console.log("显示选择数据,下标为", e.detail.value)
    // console.log("显示选择数据,值为",this.data.array[e.detail.value])
    this.setData({
      index: e.detail.value
    })
   user_sex=this.data.array[e.detail.value]
  },
  getName(e){
    user_name=e.detail.value
   },
   getNum(e){
    user_num=e.detail.value
   },
   getPname(e){
    user_pname=e.detail.value
   },
   getTele(e){
    user_tele=e.detail.value
   },
   getCareer(e){
    user_career=e.detail.value
   },
   getMail(e){
    user_mail=e.detail.value
   },

   //插入user表
   addUserMessage(){
    
    if(user_name&&user_num){
      db.where({
        openid:openid
      })
      .update({
        data:{
          Name:user_name,
          Number:user_num,
          // Index:this.data.index,
          Pname:user_pname,
          Telephone:user_tele,
          Career:user_career,
          Mail:user_mail,
          Sex:user_sex

        } }).then(res=>{
          console.log("基本信息添加成功",res)
          wx.showToast({
            title: '实名认证成功',
            duration: 150000
          })
          var timeout=setTimeout(() => {
            wx.navigateBack({changed:true})
          }, 300);
        })      
    }
    else if(!user_name){
      //console.log("真实姓名为空")
      wx.showToast({
        // 弹窗类型为错误，默认为空，none是无
        icon:"error",
        title: '真实姓名为空',
      })
    }
    else if(!user_num){
     // console.log("身份证号为空")
      wx.showToast({
        // 弹窗类型为错误，默认为空，none是无
        icon:"error",
        title: '身份证号为空',
      })
    }
   }
})