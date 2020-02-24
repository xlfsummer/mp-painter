import Vue from 'vue'
import App from './App'

import WebLink from "./components/webLink.vue";

Vue.config.productionTip = false

App.mpType = 'app'

Vue.component("web-link", WebLink);

const app = new Vue({
  ...App
})

app.$mount()
