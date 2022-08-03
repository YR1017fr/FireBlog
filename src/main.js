import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vue2Editor from "vue2-editor";
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Vue2Editor);

Vue.config.productionTip = false;

let app

// 利用firebase本身提供的方法在獲取API之後創建vue
firebase.auth().onAuthStateChanged(() => {
  if(!app) {
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
})
