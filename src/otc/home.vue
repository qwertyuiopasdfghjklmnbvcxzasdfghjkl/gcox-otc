<template>
  <div class="cont">
    <div class="otchome">
      <news />
      <div class="home-bottom">
        <div class="home-bottom-left">
          <business ref="business" :params="params"/>
          <exponent ref="exponent" :params="params"/>
        </div>
        <div class="home-bottom-right">
          <pendorder ref="pendorder" :params="params" @goToMyCenter="goToMyCenter" @goToSettings="goToSettings" @createNewOrder="createNewOrder"/>
        </div>
      </div>
      <orderlist ref="orderlist" :hparams="params" @switchOldMessage="switchOldMessage" @addSystemMessage="addSystemMessage"/>
      <adlist ref="adlist" :params="params" @goToMyCenter="goToMyCenter" @goToSettings="goToSettings"/>
      <chat ref="chat" v-if="getApiToken"
            v-show="showChat" v-model="showChat"
            :orderNumber="orderNumber"
            :switchNew="switchNew"
            :firstEnter="firstEnter" @markNewMsg="markNewMsg"/>
      <em class="chat-icon" :class="{'new':newMsg}" v-if="getApiToken" @click="openChat"></em>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import hopscotch from 'hopscotch'
import otcApi from '@/api/otc'
import otcConfig from '@/assets/js/otcconfig'
import otcHopscotch from '@/assets/js/otc-hopscotch'
import business from '@/otc/otchome/business'
import news from '@/otc/otchome/news'
import exponent from '@/otc/otchome/exponent'
import pendorder from '@/otc/otchome/pendorder'
import orderlist from '@/otc/otchome/orderlist'
import adlist from '@/otc/otchome/adlist'
import chat from '@/components/chat'
export default {
  components: {
    news,
    business,
    exponent,
    pendorder,
    orderlist,
    adlist,
    chat
  },
  data () {
    let otcParams = localStorage.getItem('otcParams')
    otcParams = otcParams ? JSON.parse(otcParams) : {}
    return {
      orderNumber: null,
      showChat: false,
      newMsg: false,
      firstEnter: 0,
      switchNew: 0,
      params: {
        ad_type: otcParams.ad_type || 2,
        symbol: otcParams.symbol || otcConfig.symbol,
        currency: /* (otcParams.symbol || otcConfig.symbol) === otcConfig.additional[0].symbol ? 'USD' : */ 'CNY',
        current_price: 100000,
        pay_type: null,
        sort_mode: 1,
        page: 1,
        show: 7,
        total: 0,
        newAdCount: 0,
        newOrderCount: 0
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
    otcParams () {
      return {
        symbol: this.params.symbol,
        ad_type: this.params.ad_type
      }
    }
  },
  watch: {
    /* 'params.symbol' (val) {
      if (val === otcConfig.additional[0].symbol) {
        this.params.currency = 'USD'
      } else {
        this.params.currency = 'CNY'
      }
    }, */
    'params.newOrderCount' () {
      this.showChat = true
    },
    otcParams () {
      localStorage.setItem('otcParams', JSON.stringify(this.otcParams))
    },
    showChat (val) {
      if (val) {
        this.firstEnter++
      }
    }
  },
  created () {
    this.$nextTick(() => {
      if (!localStorage.getItem('otcHopscotch')) {
        // hopscotch.startTour(otcHopscotch)
      }
    })
  },
  beforeDestroy () {
    hopscotch.endTour(otcHopscotch)
  },
  methods: {
    goToMyCenter () {
      this.$router.push({name: 'mycenter_menu', params: {menu: 'authentication'}})
    },
    goToSettings () {
      this.$router.push({name: 'mycenter_menu', params: {menu: 'settings'}})
    },
    createNewOrder (id) {
      if (this.$refs.orderlist.params.state === 1) {
        this.$refs.orderlist.params.page = 1
      }
      otcApi.ordersDetail(id, (res) => {
        this.orderNumber = res.orderInfo.order_number
      })
    },
    openChat () {
      this.showChat = !this.showChat
      this.newMsg = false
    },
    markNewMsg (bool) {
      if (bool) {
        this.showChat = true
      }
      this.newMsg = bool
    },
    switchOldMessage (orderNumber) {
      this.showChat = true
      this.switchNew++
      this.orderNumber = orderNumber
    },
    addSystemMessage (orderNumber, message) { // 添加系统消息
      this.showChat = true
      this.$refs.chat.addSystemMessage(orderNumber, message)
    }
  }
}
</script>
<style scoped>
  .cont{
    background: url("../assets/img/bg_common.png") no-repeat center #1f1e24;
    min-height: calc(100vh - 365px);
    background-attachment: fixed;
  }
.otchome{width: 1200px;padding-top: 8px;padding-bottom: 60px;margin: 0 auto;}
.otchome::before {content: ''; position: fixed; left: 0; top: 0; right: 0; bottom: 0; background-color: #F2F3F8; z-index: -1;}
.home-bottom{display: flex;justify-content: space-between;margin-bottom: 8px;}
.home-bottom-left{width:300px;}
.home-bottom-right{width:892px;display:flex;flex:1;margin-left:8px;}
.news{display: none;}
.chat-icon{position:fixed;z-index:999;left:4px;bottom:4px;width:70px;height:70px;cursor:pointer;background:url(../assets/images/chat.png) no-repeat center;}
.chat-icon:hover{background-image:url(../assets/images/chat_hover.png);}
.new::after{content:" ";width:12px;height:12px;background:#ff0000;position:absolute;right:-1px;top:-1px;border-radius:50%;}
</style>
