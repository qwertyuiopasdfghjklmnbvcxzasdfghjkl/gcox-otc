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
           @switchOldMessage="switchOldMessage"
           @addSystemMessage="addSystemMessage"/>
      <div>
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
        m: null
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getUserInfo']),
    },
    created () {
      console.log(this.$route.query.id)
      this.order_id = this.$route.query.id
      this.getData()
    },
    methods: {
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
      getData () {
        otcApi.ordersDetail(this.order_id, (item, serverTime) => {

          this.data = item
          this.m = this.getUserInfo.userId === item.from_user_id ? 1 : 2
          this.time = serverTime
        })
      }
    }
  }
</script>

<style scoped>

</style>
