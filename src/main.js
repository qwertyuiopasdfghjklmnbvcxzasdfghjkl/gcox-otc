// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import store from '@/vuex'
import Vtip from '@/assets/js/vtip.min'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import '@/components/dialog'
import '@/components/confirm'
import '@/components/ajaxLoading'
import '@/components/messageTipBox'
import '@/assets/js/vee-validate'
import 'hopscotch/dist/css/hopscotch.min.css'
import 'vtip/lib/index.min.css'
import '@/assets/css/style.css'
import '@/assets/css/mian.css'
import '@/assets/css/swiper.min.css'
import '@/assets/css/country.css'
import langApi from '@/api/language'

import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title.js'

import loading from '@/components/loading'

import VueClipboard from 'vue-clipboard2'
import gjh from '../src/gjh'

// import * as Sentry from '@sentry/browser'
// import * as Integrations from '@sentry/integrations'

// if(process.env.NODE_ENV !== 'development'){
//   Sentry.init({
//     dsn: 'https://0502e238d6194626b8c23f27dff83ba9@sentry.io/1538112',
//     integrations: [new Integrations.Vue({Vue, attachProps: true})],
//   });
// }

import Cryptoicon from 'vue-cryptoicon'
// For all icons
import icon from 'vue-cryptoicon/src/icons'

Cryptoicon.add(icon)
Vue.use(Cryptoicon)

Vue.use(VeeValidate)
Vue.use(VueI18n)
Vue.use(Vtip.directive)
Vue.use(VueAwesomeSwiper)
Vue.component('v-chart', ECharts)
Vue.use(VueClipboard)
Vue.component('loading', loading)

let i18n = window.$i18n = new VueI18n({
  locale: 'en',
  messages: {
    'zh-CN': null,
    'en': null
  },
  silentTranslationWarn: true
})

Vue.config.productionTip = false

router.afterEach(() => {
  window.scrollTo(0, 0)
})

/* eslint-disable no-new */
let lang = window.localStorage.getItem('lang') || 'en'
let tar = document.getElementsByTagName('title')
if (lang === 'en') {
  tar[0].innerText = 'GCOX - Global Crypto Offering Exchange'
} else {
  tar[0].innerText = 'GCOX-比特币以太坊专业数字货币交易网站'
}

if (process.env.NODE_ENV !== 'development') {
  window.console.log = () => {
  }
  window.console.error = () => {
  }
}

// Object.assign(res, gjh)
langApi.getLanguage(lang, (res) => {
  i18n.locale = lang
  let l = res
  if (location.hostname !== 'otc.gcox.sit.koall.io') {
    l = Object.assign(res, gjh)
  }
  i18n.setLocaleMessage(lang, l)
  window.vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: {App}
  })
}, (msg) => {
  window.vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: {App}
  })
  console.error(msg)
})
