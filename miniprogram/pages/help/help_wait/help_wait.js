
Page({

  /**
   * 页面的初始数据
   */
  data: {
  makers:[],
 
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getLocation({
      type: 'wgs84',
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

     //从数据库调用救援队的地理位置，进行地点赋值(修改属性iconPath:"/static/images/Others.png",width:80,height:65,)
    

    

  },
  sendhelp(){

    //将救助人地址加入makers集合中
    wx.cloud.database().collection('offerhelpmakers')
    .add({
      data:{
        makers:this.data.makers
      }
    })
    .then(res=>{
      console.log("个人救助地址加入数据库成功",res)
    })
    .catch(err=>{
      console.log("个人救助地址加入数据库失败",err)
    })

    //个人state变成3
    wx.cloud.database().collection('user').where({openid:this.data.openid})
    .update({
      data:{
        state:3
      }
    })
    .then(res=>{
      console.log("用户状态3修改成功",res)
    })
    .catch(err=>{
      console.log("用户状态3修改失败",err)
    })
    wx.navigateTo({
      url: '/pages/help/helping/helping',
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