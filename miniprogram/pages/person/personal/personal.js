// pages/personal/personal.js
const db = wx.cloud.database().collection('user')
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl:"",
    isloggin:false,
    openid:"",
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
  onShow() {
  
    if(wx.getStorageSync('UserInfo')){
      let UserInfo= wx.getStorageSync('UserInfo')
      wx.cloud.callFunction({
        name:"getOpenid"
      }).then(res=>{
        let openid=res.result.openid
    // 
        db.where({openid:openid}).count()
        .then(res=>{
          console.log("查询是否加入数据库",res)
          if(res.total!=0){

            db.where({openid:openid}).get()
            .then(res=>{
              console.log("查询个人信息成功",res.data) 
       //     
            let list0=res.data[0]  
            app.globalData.userInfo=list0
            console.log("全局变量为",app.globalData.userInfo)
             this.setData({
              // list:res.data[0],
              isloggin: true
             }) 
             app.globalData.isloggin=this.data.isloggin
              console.log("全局登录状态为",app.globalData.isloggin)
    
            })
            // this.setData({
            //   isloggin: true
            //  })
            //  app.globalData.isloggin=this.data.isloggin
            //  console.log("全局登录状态为",app.globalData.isloggin)
         } 
        
        })
      })
     
 this.setData({
  userInfo:UserInfo,
 })

  }
    
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
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', 
      success: (res) => {
        let  user=res.userInfo
        let avatarUrl=user.avatarUrl  //
        wx.setStorageSync( 'UserInfo', user)
         console.log("获取成功",res.userInfo)
   //将头像存入数据库（先判断数据库是否已经存入该openid）
         wx.cloud.callFunction({
           name:"getOpenid"
         }).then(res=>{
          //  console.log("获取openID成功",res.result.openid)
          this.setData({
            openid:res.result.openid
          }) 
           wx.cloud.callFunction({
             name:"queryOpenid",
             data:{
               openid:this.data.openid
             }
           }).then(res=>{
             console.log("查询成功",res.result)
             
             if(res.result.data.length==0)
             { console.log("数据库中无")
               db.add({
                 data:{
                   openid:this.data.openid,
                   userphoto:avatarUrl,
                   state:0
                 } }).then(res=>{
                   console.log("添加成功",res)


                   db.where({openid:this.data.openid}).get()
                   .then(res=>{
                     let list0=res.data[0]  
     
                     app.globalData.userInfo=list0
                     console.log("全局变量为",app.globalData.userInfo)
     
    
                   })

                   
                 })       
             }
             else{
              console.log("数据库中有")
              wx.cloud.callFunction({
                name:"uploadUserphoto",
                data:{
                  photo:avatarUrl,
                  openid:this.data.openid
                }
              }).then(res=>{
              })

              //放入全局变量
              db.where({openid:this.data.openid}).get()
              .then(res=>{
                let list0=res.data[0]  

                app.globalData.userInfo=list0
                console.log("全局变量为",app.globalData.userInfo)


              })

             }
           })       
         })     
    // 界面显示   
        this.setData({
          userInfo: res.userInfo,
          isloggin: true
        })
        app.globalData.isloggin=this.data.isloggin
        console.log("全局登录状态为",app.globalData.isloggin)
      }
    })
  },
})