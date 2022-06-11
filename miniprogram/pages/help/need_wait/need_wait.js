// pages/help/need_wait/need_wait.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  makers:[],
  waiting:false
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getLocation({
      // type: 'wgs84',
      isHighAccuracy: true, // 开启地图精准定位
      type: 'gcj02', // 地图类型写这个
      success (res) {
        that.setData({
          makers:[{
           latitude:res.latitude,
           longitude:res.longitude,
           speed:res.speed,
           iconPath:"/static/images/needposition.png",
           width:25,
           height:25,
          
          }]
       })
      }
     })
     
     console.log(this.data.makers) 

     //从数据库调用救援队的地理位置，进行地点赋值(修改属性iconPath:"/static/images/offer.png",width:80,height:65,)
    

    

  },
  sendneed(){
    
    //将被救助人地址加入makers集合中
    wx.cloud.database().collection('needhelpmakers')
    .add({
      data:{
        makers:this.data.makers
      }
    })
    .then(res=>{

      console.log("个人地址加入数据库成功",res)
    })
    .catch(err=>{
      console.log("个人地址加入数据库失败",err)
    })

    
    this.setData({
      waiting:true
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