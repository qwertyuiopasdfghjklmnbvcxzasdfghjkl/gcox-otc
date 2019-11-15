<template>
  <div>
    <div class="w800">
      <sell v-if="m === 1"
            :timer="time"
            :item="data"/>
      <buy v-if="m === 2"
           ref="orderlist"
           :data="data"
           :time="time"
           :ad-info="adInfo"
           @switchOldMessage="switchOldMessage"
           @addSystemMessage="addSystemMessage"/>
      <div class="h500">
        <chat ref="chat"
              v-show="showChat" v-model="showChat"
              :orderNumber="orderNumber"
              :switchNew="switchNew"
              :firstEnter="firstEnter" @markNewMsg="markNewMsg"/>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import buy from './order/buy'
  import sell from './order/sell'
  import chat from '@/components/chat'
  import {mapGetters, mapActions} from 'vuex'
  import otcApi from '@/api/otc'

  export default {
    name: 'orderDetail',
    components: {buy, chat, sell},
    data () {
      return {
        showChat: true,
        orderNumber: null,
        switchNew: 0,
        firstEnter: 0,
        order_id: null,
        data: {},
        time: null,
        from_user_id: null,
        m: null,
        adInfo: {}
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getUserInfo']),
    },
    watch: {
      getApiToken () {
        this.getData()
      },
      // 'params.state' () {
      //   // 监听顺序：params.state > paramsChange可避免代码重复执行
      //   this.params.page = 1
      // },
    },
    created () {
      console.log(this.$route.query.id)
      this.order_id = this.$route.query.id
      this.getData()
      this.$nextTick(() => {
        this.addEvents({
          name: 'updateOrderList',
          fun: this.getData
        })
      })
      this.addOtcSocketEvent(this.getData)
    },
    beforeDestroy () {
      // this.intervals.forEach((interval) => {
      //   clearInterval(interval)
      // })
      this.removeEvents('updateOrderList')
      this.removeOtcSocketEvent(this.systemEvent)
    },
    methods: {
      ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent', 'addEvents', 'removeEvents', 'tiggerEvents']),

      systemEvent (data) {
        let optType = parseInt(data.operate_type)
        let childType = parseInt(data.child_type)
        console.log(childType)
        if (optType === 1) { // 系统消息
          switch (childType) {
            case 31: // 新建订单消息
            case 32: // 取消订单消息
            case 33: // 系统自动取消订单消息
            case 34: // 买家付款消息
            case 35: // 正常放币消息
            case 36: // 强制放币买家消息
            case 37: // 强制放币卖家消息
            case 38: // 解除锁币消息
              let orderNumber = JSON.parse(data.link).order_number
              if (childType === 34) {
                Vue.$confirmDialog({
                  id: 'pay_success_tip',
                  showCancel: false,
                  content: this.$t('error_code.CONFIRM_PAYMENT') // 买方已经标记确认付款，请查收！
                })
                if (orderNumber === this.data1.order_number) {
                  this.data1.pay_state = 1
                }
              } else if (childType === 35) {
                Vue.$confirmDialog({
                  id: 'put_coin_success_tip',
                  showCancel: false,
                  content: this.$t('error_code.CONFIRM_PAYMENT_RECEIPT') // 卖方确认收款，已放币！请进行评价！
                })
                if (orderNumber === this.data1.order_number) {
                  this.data1.state = 2
                }
              } else {
                this.getData()
              }
              break
          }
        }
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
      },
      outTime(){
        this.getData()
      },
      getData () {
        otcApi.ordersDetail(this.order_id, (item, serverTime, adInfo) => {
          this.data = item
          this.adInfo = adInfo
          console.log(this.adInfo)
          this.m = this.getUserInfo.userId === item.from_user_id ? 1 : 2
          this.time = serverTime
          this.orderNumber = item.order_number
        })
      }
    }
  }
</script>

<style scoped>
.h500{
  height: 500px;
  margin: 30px 0;
}
</style>
