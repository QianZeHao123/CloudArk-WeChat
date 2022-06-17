const app = Vue.createApp({
  template: `<van-button>按钮</van-button>`,
});
app.use(vant);
app.use(vant.Lazyload);
vant.Toast('提示');
app.mount('#app');