import Vue from 'vue'
import App from './App'

import WebLink from "./components/webLink.vue";
import PageSourceLink from "./components/pageSourceLink.vue";

Vue.config.productionTip = false

App.mpType = 'app'

Vue.component("web-link", WebLink);
Vue.component("page-source-link", PageSourceLink);

const app = new Vue({
  ...App
})

app.$mount()
