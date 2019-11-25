<template>
  <div class="wrap">
    <!--下拉-->
    <select-index :params="params" @change="change" :buyCur="buyCur" :sellCur="sellCur"/>

    <!-- 币种 -->
    <!--<symbol-list :params="params" @change="change" :buyCur="buyCur" :sellCur="sellCur"/>-->

    <!-- 通知 -->
    <!--<notice/>-->
    <!--推荐市场-->
    <!--<indexrecom ref="indexrecom"/>-->
    <!--数据表格-->
    <!--<indexdatatable/>-->

    <!--列表-->
    <list-index :params="params" @buyCur="getBuyCur" @sellCur="getSellCur"/>

    <div class="law" v-if="false">
      <div class="w1200 cont">
        <div>
          <h2>$500M+</h2>
          <p>Digital currency exchanged</p>
        </div>
        <div>
          <h2>30+</h2>
          <p>Countries supported</p>
        </div>
        <div>
          <h2>1.5M+</h2>
          <p>Customers served</p>
        </div>
      </div>
    </div>

    <tipbox v-if="false"/>
    <!--<news/>-->

    <!--<download/>-->

    <!--<regbox/>-->

    <!--<div class="cat" v-show="showChat">-->
    <!--<chat ref="chat" v-if="getApiToken"-->
    <!--v-show="showChat" v-model="showChat"-->
    <!--:orderNumber="orderNumber"-->
    <!--:switchNew="switchNew"-->
    <!--:firstEnter="firstEnter" @markNewMsg="markNewMsg"/>-->
    <!--</div>-->

    <!--<em class="chat-icon" :class="{'new':newMsg}" v-if="getApiToken" @click="openChat"></em>-->
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import indexdatatable from '@/public/index/datatable'
  import indexslider from '@/public/index/indexslider'
  import notice from '@/public/index/notice'
  import indexrecom from '@/public/index/indexrecom'
  import tipbox from '@/public/index/tipbox'
  import news from '@/public/index/news'
  import download from '@/public/index/download'
  import regbox from '@/public/index/regbox'
  import SelectIndex from './index/select-index'
  import ListIndex from './index/list-index'
  import chat from '@/components/chat'
  import otcApi from '@/api/otc'
  import SymbolList from './index/symbol-list'

  export default {
    name: 'app',
    components: {
      SymbolList,
      ListIndex,
      SelectIndex,
      indexdatatable,
      indexslider,
      notice,
      indexrecom,
      tipbox,
      news,
      download,
      regbox,
      chat
    },
    data () {
      return {
        showChat: false,
        orderNumber: null,
        newMsg: false,
        firstEnter: 0,
        switchNew: 0,
        buyCur: 0,
        sellCur: 0,
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getLang', 'getSymbol', 'getCurrency']),
      params () {
        let data = this.getSymbol
        data.currency = this.getCurrency
        return data
      },
    },
    watch: {
      getApiToken () {
        this.socket && this.socket.changeLogin()
      },
      'params.newOrderCount' () {
        this.showChat = true
      },
      showChat (val) {
        if (val) {
          this.firstEnter++
        }
      }
    },
    created () {
    },
    methods: {
      ...mapActions(['setSymbol']),
      change (e) {
        console.log(e)
        this.setSymbol(e)
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
      },
      getBuyCur (e) {
        this.buyCur = e
        console.log(e)
      },
      getSellCur (e) {
        this.sellCur = e
      }
    },
  }
</script>

<style scoped lang="less">
  .law {
    background: #13143A;
    overflow: auto;
    margin-top: 35px;

    .cont {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 100px auto;

      div {
        text-align: center;
        color: #ffffff;

        h2 {
          font-size: 48px;
          font-weight: 400;
          margin-bottom: 20px;
        }

        p {
          font-size: 24px;
        }
      }
    }
  }

  .cat {
    position: fixed;
    left: 10px;
    bottom: 20px;
    width: 600px;
    height: 400px;
    z-index: 999;
    background: #ffffff;
    border-radius: 4px;
  }

  .chat-icon {
    position: fixed;
    z-index: 999;
    left: 4px;
    bottom: 4px;
    width: 70px;
    height: 70px;
    cursor: pointer;
    background: url(../assets/images/chat.png) no-repeat center;
  }

  .chat-icon:hover {
    background-image: url(../assets/images/chat_hover.png);
  }

  .new::after {
    content: " ";
    width: 12px;
    height: 12px;
    background: #ff0000;
    position: absolute;
    right: -1px;
    top: -1px;
    border-radius: 50%;
  }
</style>

