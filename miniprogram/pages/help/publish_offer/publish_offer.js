// pages/help/publish_offer/publish_offer.js
const db = wx.cloud.database().collection('offerhelp')
// 引入SDK核心类
var QQMapWX=require('../../utils/qqmap-wx-jssdk.js')
// 实例化API核心类
const wxMap = new QQMapWX({
  key: 'E2NBZ-2UCCU-HTNV3-BOLYI-5ERXE-5EBRZ'
});

const app=getApp()
let offer_tele=''
let offer_message=''

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    ischooseposition:false,
    region: ['全部', '全部', '全部'],
    customItem: '全部',
    //1为选择器，2为文本框
    addresstype:1,
    wxtelephone:'',
    openid:'',
    address:''
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      ischooseposition:true,
      region: e.detail.value
    })
  },
   //提交表单
 submit(){

   //插入数据
   if(offer_tele&&offer_message&&this.data.region){

    db.add({
      data:{
       OfferTelephone:offer_tele,
       OfferMessage:offer_message,
       OfferAddress:this.data.region,
      //定位地址，string
      NeedPresentAddress:this.data.address   
      //  OfferWXTelephone:this.data.wxtelephone
      }
    })
    .then(res=>{
      console.log("添加成功",res)

      //改变用户状态为提供帮助态 1
      wx.cloud.database().collection('user').where({openid:this.data.openid})
      .update({
        data:{
          state:1
        }
      })
      .then(res=>{
        console.log("用户状态修改成功",res)

      })
      .catch(err=>{

      })

      //删除求助表内记录
      wx.cloud.database().collection('needhelp')
      .where({
        _openid:this.data.openid
      }).remove()
      .then(res=>{

      })
      .catch(err=>{

      })



      //删除求助表内坐标记录
      wx.cloud.database().collection('needhelpmakers')
      .where({
        _openid:this.data.openid
      }).remove()
      .then(res=>{

      })
      .catch(err=>{

      })

    })
    .catch(err=>{
    })
   }




  

  wx.navigateTo({
    url: '/pages/help/help_wait/help_wait'
  })
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let openid=app.globalData.userInfo.openid
    this.setData({
      openid:openid
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
  getOfferTele(e){
    offer_tele=e.detail.value
 
   },
   getOfferMessage(e){
    offer_message=e.detail.value
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
    offer_tele=res.data[0].Telephone
    })
    .catch(err=>{

    })
  }
})