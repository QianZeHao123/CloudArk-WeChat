// index.js
// const app = getApp()
const { envList } = require('../../envList.js');
const db = wx.cloud.database().collection('user')
const app=getApp()
let state=
Page({
  data: {
    showUploadTip: false,
    powerList: [{
      title: '云函数',
      tip: '安全、免鉴权运行业务代码',
      showItem: false,
      item: [{
        title: '获取OpenId',
        page: 'getOpenId'
      },
      //  {
      //   title: '微信支付'
      // },
       {
        title: '生成小程序码',
        page: 'getMiniProgramCode'
      },
      // {
      //   title: '发送订阅消息',
      // }
    ]
    }, {
      title: '数据库',
      tip: '安全稳定的文档型数据库',
      showItem: false,
      item: [{
        title: '创建集合',
        page: 'createCollection'
      }, {
        title: '更新记录',
        page: 'updateRecord'
      }, {
        title: '查询记录',
        page: 'selectRecord'
      }, {
        title: '聚合操作',
        page: 'sumRecord'
      }]
    }, {
      title: '云存储',
      tip: '自带CDN加速文件存储',
      showItem: false,
      item: [{
        title: '上传文件',
        page: 'uploadFile'
      }]
    }, {
      title: '云托管',
      tip: '不限语言的全托管容器服务',
      showItem: false,
      item: [{
        title: '部署服务',
        page: 'deployService'
      }]
    }],
    envList,
    selectedEnv: envList[0],
    haveCreateCollection: false,
    userInfo: {},
    isloggin:false,
    state:0

  },

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail (res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },
  jumphelp(){
    if(this.data.state==1)
    {wx.navigateTo({
      url: '/pages/help/helping/helping',
    })}
    else{
      wx.navigateTo({
        url: '/pages/help/publish_offer/publish_offer',
      })
    }

  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  },
  
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
          // console.log("查询是否加入数据库",res)
          if(res.total!=0){

            db.where({openid:openid}).get()
            .then(res=>{
              // console.log("查询个人信息成功",res.data) 
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
    
              state=app.globalData.userInfo.state
              console.log("用户救援状态为",state)
              this.setData({
                state:state
              })
            })
           
         } 
        
        })
      })
     
 this.setData({
  userInfo:UserInfo,
 })

  }
  
},

});
