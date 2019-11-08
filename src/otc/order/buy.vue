<template>
  <div class="order-list">

    <div class="order-list-content">
      <p><span class="numer">{{$t('otc_exchange.otc_exchange_order_number')}}：
        <!--订单编号-->{{data1.order_number}}</span></p>
      <ul class="step">
        <li :class="{active: step >= 0, current:step===0}">
          1.{{$t('public0.public143')}}
          <!--新建交易-->
        </li>
        <li :class="{active: step >= 1, current:step===1}">
          2.{{$t('public0.public144')}}
          <!--请先付款-->
        </li>
        <li :class="{active: step >= 2, current:step===2}">
          3.{{$t('public0.public145')}}
          <!--等待放币-->
        </li>
        <li :class="{active: step >= 3, current:step===3}">
          4.{{$t('public0.public146')}}
          <!--完成交易-->
        </li>
      </ul>
      <div v-html="$t('gcox_otc.order_text').format(data1.symbol_count, data1.symbol, data1.from_user_name)"></div>
      <div class="tab">
        <table width="100%">
          <tr bgcolor="#eeeeee">
            <td colspan="2" align="center">{{$t('otc_ad.otc_order_details')}}</td>
          </tr>
          <tr>
            <td width="30%">{{$t('public0.public149')}}</td>
            <td><b>{{data1.from_user_name}}</b></td>
          </tr>
          <tr>
            <td>{{$t('otc_exchange.otc_exchange_ask')}}</td>
            <td>{{data1.cur_price}} {{data1.currency}}</td>
          </tr>
          <tr>
            <td>{{$t('exchange.exchange_amount')}}</td>
            <td>{{data1.symbol_count}} {{data1.symbol}}</td>
          </tr>
          <tr>
            <td>{{$t('gcox_otc.total')}}</td>
            <td><span class="red">{{data1.total_price}}</span> <b>{{data1.currency}}</b></td>
          </tr>
          <tr>
            <td>{{$t('otc_ad.otc_ad_status')}}</td>
            <td>
              <span class="gray_button " v-if="data1.pay_state === 1">{{$t('public0.public154')}}</span>
              <span class="gray_button " v-if="data1.pay_state === 2">{{$t('otc_exchange.otc_exchange_transactions_completed1')}}</span>
              <span class="green_button" v-if="data1.pay_state !== 2">{{stateTitle}}</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="tab" v-if="cancelStatus !== 1 && data1.state === 1">
        <table width="100%">
          <tr bgcolor="#eeeeee">
            <td colspan="2" align="center">{{$t('gcox_otc.pay_info')}}</td>
          </tr>
          <tr>
            <td width="30%">{{$t('gcox_otc.payment_method')}}</td>
            <td>{{$t('otc_legal.oyc_legal_Bank_card')}}</td>
          </tr>
          <tr>
            <td>{{$t('public0.public65')}}</td>
            <td>{{payInfo.card_name}}</td>
          </tr>
          <tr>
            <td>{{$t('otc_legal.otc_legal_Bank')}}</td>
            <td>{{payInfo.card_bank}}</td>
          </tr>
          <tr>
            <td>{{$t('otc_legal.otc_legal_Bank_number')}}</td>
            <td>{{payInfo.card_number}}</td>
          </tr>
        </table>
      </div>
      <div class="countdown" v-if="data1.pay_state === 0 && data1.from_user_name !== getUserInfo.username && cancelStatus !== 1">
        <span>{{$t('public0.public62')}}</span>
        <b class="timer">{{surplus_Time}}</b>
      </div>
      <p class="time_text" v-if="cancelStatus !== 1">
        {{$t('gcox_otc.time_out')}}
      </p>
      <div class="red_note" v-if="cancelStatus === 1">
        {{$t('gcox_otc.cancel_not_pay')}}
      </div>

      <div class="undone-center" v-if="data1.state === 2">
        <!--<div class="undone-center-buys">-->
          <!--<p>{{$t('otc_exchange.otc_exchange_buy')}}&lt;!&ndash;购买&ndash;&gt;</p>-->
          <!--<p>{{item.symbol}}</p>-->
        <!--</div>-->
        <div class="undone-center-type" v-if="!data1.from_user_comment">
          <!--{{$t('otc_ad.otc_ad_prompt9')}}&lt;!&ndash;交易成功！请评价对方&ndash;&gt;-->
        </div>
        <div class="undone-center-adress ui-flex">
          <span class="">{{$t('otc_ad.otc_ad_prompt9')}}</span>
          <div class="evaluate ui-flex-1 ml60">
            <ul>
              <li @click="commentType = 1" v-if="!data1.from_user_comment || data1.from_user_comment === 1">
                <em class="myicon-praise" :class="{active: commentType === 1}"></em>
                <p>{{$t('otc_ad.otc_ad_Praise')}}<!--好评--></p>
              </li>
              <li @click="commentType = 2" v-if="!data1.from_user_comment || data1.from_user_comment === 2">
                <em class="myicon-average" :class="{active: commentType === 2}"></em>
                <p>{{$t('otc_ad.otc_ad_Average')}}<!--中评--></p>
              </li>
              <li @click="commentType = 3" v-if="!data1.from_user_comment || data1.from_user_comment === 3">
                <em class="myicon-bad-review" :class="{active: commentType === 3}"></em>
                <p>{{$t('otc_ad.otc_ad_Bad_review')}}<!--差评--></p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="btn_box">
        <p v-if="cancelStatus !== 1">
          <a href="javascript:;" v-if="data1.state === 1" :class="{disabled: data1.pay_state !== 0}" @click="confirm">{{$t('public0.public154')}}
            <!--已支付--></a>
          <a href="javascript:;" v-if="data1.state === 2" :class="{disabled: data1.from_user_comment}"
             @click="evaluation">{{$t('otc_ad.otc_ad_confirm')}}
            <!--确认--></a>
        </p>
        <template v-if="data1.pay_state === 1">
          <em @click="apeal(data1)" v-if="data1.appeal_state !== 0">
            {{$t('otc_exchange.otc_exchange_complaint')}}
            <!--发起申诉--></em>
          <em @click="cancelApeal(data1)" v-if="data1.appeal_state === 0">
            {{$t('public0.public208')}}
            <!--取消申诉--></em>
        </template>
        <template v-if="data1.pay_state === 0 && data1.from_user_name !== getUserInfo.username">
          <em @click="cancelOrderByConfirm(data1)" :class="{disabled: cancelStatus === 1}">
            {{$t('otc_ad.otc_ad_cancel_order')}}
            <!--取消订单--></em>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'
  import numUtils from '@/assets/js/numberUtils'
  import appeal from '@/otc/otchome/appeal'
  import loading from '@/components/loading'
  import page from '@/components/page'
  import Adlist from '../otchome/adlist'

  export default {
    props: ['orderId', 'data', 'time'],
    components: {
      Adlist,
      loading,
      page
    },
    data () {
      return {
        data1: {}, // 未完成订单
        intervals: [],
        commentType: 1,
        params: {
          state: 1,
          page: 1,
          total: 0
        },
        surplus_Time: null,
        payInfo: {},
        cancelStatus: null,
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getUserInfo']),
      step () {
        if (this.data1.state === 1 && this.data1.pay_state === 0) {
          return 1 // 未付款
        } else if (this.data1.state === 1 && this.data1.pay_state === 1) {
          return 2 // 已付款
        } else if (this.data1.state === 2) {
          return 3 // 已放币，交易完成
        } else {
          return 0
        }
      },
      stateTitle () {
        if (this.data1.state === 2) {
          return this.$t('public0.public146')
        } else if (this.data1.pay_state === 0) {
          return this.$t('public0.public152')
        } else if (this.data1.pay_state === 1) {
          return this.$t('public0.public145')
        } else if (this.cancelStatus === 1) {
          return this.$t('public0.public25')
        } else {
          return null
        }
      },
    },
    watch: {
      getApiToken () {
        this.getOrderList()
      },
      'params.state' () {
        // 监听顺序：params.state > paramsChange可避免代码重复执行
        this.params.page = 1
      },
      'hparams.newOrderCount' () {
        this.getOrderList()
      }
    },
    created () {
      this.getOrderList()
      this.$nextTick(() => {
        this.addEvents({
          name: 'updateOrderList',
          fun: this.getOrderList
        })
      })
      this.addOtcSocketEvent(this.systemEvent)

    },
    beforeDestroy () {
      this.intervals.forEach((interval) => {
        clearInterval(interval)
      })
      this.removeEvents('updateOrderList')
      this.removeOtcSocketEvent(this.systemEvent)
    },
    methods: {
      ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent', 'addEvents', 'removeEvents', 'tiggerEvents']),
      getPays () {
        otcApi.getPaySettingsNoToken({
          user_id: this.data1.from_user_id
        }, (res) => {
          this.payInfo = res.data
        })
      },
      systemEvent (data) {
        let optType = parseInt(data.operate_type)
        let childType = parseInt(data.child_type)
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
                this.getOrderList()
              }
              break
          }
        }
      },
      getOrderList () { // 获取订单列表
        if (!this.getApiToken) {
          return
        }
        this.data1 = []
        this.intervals.forEach((interval) => {
          clearInterval(interval)
        })
        this.intervals = []

        // 类型转换
        this.data1 = this.data
        this.data1.state = parseInt(this.data.state)
        this.data1.pay_state = parseInt(this.data.pay_state)
        this.data1.to_user_apply = parseInt(this.data.to_user_apply)
        this.data1.trade_type = parseInt(this.data.trade_type)
        this.data1.from_user_comment = parseInt(this.data.from_user_comment)
        this.data1.to_user_comment = parseInt(this.data.to_user_comment)

        this.data1.pay_type = `${this.data.pay_type || ''}`
        this.data1.cur_price = utils.removeEndZero(numUtils.BN(this.data.cur_price).toFixed(2))
        this.data1.symbol_count = utils.removeEndZero(numUtils.BN(this.data.symbol_count).toFixed(8))
        this.data1.total_price = utils.removeEndZero(numUtils.BN(this.data.currency_count).toFixed(2))
        this.data1.surplus_Time = '00:00'
        let date = utils.formatDate(this.data.apply_time).getTime()
        let ndate = utils.formatDate(this.time).getTime()
        let diffTime = Math.floor((ndate - date) / 1000)
        let surplusTime = this.data.pay_apply_time * 60 - diffTime
        let interval = utils.countDown(surplusTime, (time) => {
          if (time === '00:00') {
            this.data1.isExpire = true
          } else if (time === '05:00' && this.data.pay_state === 0) {
            // 您的付款确认时间还剩5分钟，5分钟后系统将自动取消订单！请付款并标记确认付款！
            Vue.$confirmDialog({
              id: 'count_down_tip',
              showCancel: false,
              content: this.$t('error_code.PAYMENT_TIMEOUT_REMIND')
            })
            // 添加系统消息
            this.$emit('addSystemMessage', this.data.order_number, 'PAYMENT_TIMEOUT_REMIND')
          }
          this.surplus_Time = time
        })
        this.intervals.push(interval)
        this.data1.isExpire = surplusTime <= 0
        this.getPays()
        console.log(this.data1)

      },
      getTradeType (data) { // 交易类型
        if (data.to_user_name === this.getUserInfo.username) {
          return this.$t('otc_exchange.otc_exchange_buy')
        }
        return this.$t('otc_exchange.otc_exchange_sell')
      },
      getBuyOrSellUser (data) {
        if (data.from_user_name === this.getUserInfo.username) {
          return `${this.$t('public0.public148')}：${data.to_user_name}`
        }
        return `${this.$t('public0.public149')}：${data.from_user_name}`
      },
      getOrderState (state) { // 获取订单状态
        if (state === 1) {
          return this.$t('public0.public14') // 交易中
        } else if (state === 2) {
          return this.$t('otc_ad.otc_ad_completed') // 已完成
        } else if (state === 3) {
          return this.$t('public0.public25') // 已取消
        } else {
          return ''
        }
      },
      cancelOrder (item, noMsg) { // 取消订单
        otcApi.cancelOrder(item.order_id, {
          system_cancel: noMsg || false
        }, (msg) => {
          this.tiggerEvents({
            name: 'chatEvent',
            params: {
              type: 'markReadOnly',
              orderNumber: item.order_number
            }
          })
          this.cancelStatus = 1
          // this.getOrderList()
          !noMsg && Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          !noMsg && Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      cancelOrderByConfirm (item) { // 取消订单 - 确认提示
        if (this.cancelStatus !== 1) {
          Vue.$confirmDialog({
            content: this.$t('error_code.CANCEL_ORDER_CONFIRM'),
            autoClose: true,
            okCallback: () => {
              this.cancelOrder(item)
            }
          })
        }
      },
      apeal (item) { // 发起申诉
        utils.setDialog(appeal, {
          orderNumber: item.order_number,
          okCallback: () => {
            this.getOrderList()
          }
        })
      },
      cancelApeal (item) { // 取消申诉
        otcApi.cancelAppeal(item.appeal_manage_id, (msg) => {
          this.getOrderList()
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      switchOldMessage (orderNumber) { // 显示已完成订单聊天记录
        this.$emit('switchOldMessage', orderNumber)
      },
      pageChange (currentIndex) {
        this.params.page = currentIndex
      },
      confirm () { // 确认付款
        if (this.data1.pay_state !== 0) {
          return
        }
        otcApi.payFinish(this.data1.order_id, {
          pay_type: 1
        }, (msg) => {
          this.data1.pay_state = 1
          this.surplus_Time = null
          this.tiggerEvents({
            name: 'chatEvent',
            params: {
              type: 'markReadOnly',
              orderNumber: this.data1.order_number
            }
          })
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      evaluation () { // 评价
        if (!this.data1.order_id || this.data1.from_user_comment) {
          return
        }
        otcApi.commentOrder(this.data1.order_id, {
          comment_type: this.commentType
        }, (msg) => {
          this.data1.from_user_comment = this.commentType
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .step {
    display: flex;
    align-items: center;
    margin: 10px 0;

    li {
      flex: 1;
      background: #eeeeee;
      height: 50px;
      line-height: 50px;
      color: #999;
      font-size: 18px;
      position: relative;
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;

      &:first-of-type {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      &:last-of-type {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;

        &:after {
          display: none;
        }
      }

      &.active {
        background: #299D82;
        color: #ffffff;

        &:after {
          background: #299D82;
        }

        &.current {
          background: #F0B936;

          &:after {
            background: #F0B936;
          }
        }
      }

      &:after {
        content: '';
        width: 24px;
        height: 24px;
        display: block;
        position: absolute;
        right: -19px;
        top: 7px;
        background: #eeeeee;
        border: 6px solid #ffffff;
        border-top-color: transparent;
        border-left-color: transparent;
        transform: rotate(-45deg);
        z-index: 9;
      }
    }
  }

  .numer {
    font-size: 18px;
    color: #333333;
    margin-top: 20px;
    display: block;
  }

  .tab {
    margin: 20px 0;

    tr {
      height: 50px;
    }

    td {
      border: 1px solid #eeeeee;
      padding: 15px;
    }
  }


  .order-list {
    font-size: 16px;
  }

  .btn_box {
    margin: 30px auto;
    display: flex;
    align-items: center;
    justify-content: center;

    & > p a, & > em {
      width: 150px;
      height: 50px;
      display: block;
      text-align: center;
      line-height: 50px;
      margin: 0 15px;
      border-radius: 4px;
      border: 1px solid #eeeeee;
      background: #F0B936;
      color: #ffffff !important;
      cursor: pointer;

      &.default {
        border-color: #666;
        background-color: #fff;
        color: #333 !important;
      }

      &.disabled {
        background: #c7c7c7;
        cursor: no-drop;
      }
    }
  }

  .undone-center-adress {
    background: #eeeeee;
    padding: 20px;
    font-size: 18px;
    line-height: 32px;
  }

  .undone-center-type {
    margin: 10px 0;
  }

  .evaluate {
    ul {
      display: flex;

      li {
        margin: 0 20px;
        text-align: center;
        cursor: pointer;

        .active {
          color: #e74c3c;
        }
        [class*=myicon-] {
          display: inline-block;
          height: 26px;
          width: 26px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          vertical-align: middle;
          margin-right: 10px;
        }
        .myicon-praise {background-image: url('../../assets/img/icon_praise_a.png');}
        .myicon-praise.active {background-image: url('../../assets/img/icon_praise_b.png');}
        .myicon-average {background-image: url('../../assets/img/icon_average_a.png');}
        .myicon-average.active {background-image: url('../../assets/img/icon_average_b.png');}
        .myicon-bad-review {background-image: url('../../assets/img/icon_bad_a.png');}
        .myicon-bad-review.active {background-image: url('../../assets/img/icon_bad_b.png');}
      }
    }
  }

  .countdown {
    height: 88px;
    line-height: 88px;
    background-color: #eee;
    border-left: 4px solid #E65656;
    font-size: 18px;
    margin-top: 20px;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .timer {
      font-size: 48px;
      padding-left: 10px;
    }

    .title {
      position: absolute;
      left: 16px;
      top: 0;
      bottom: 0;
    }
  }

  .chat-container {
    margin-top: 30px;
    padding-bottom: 150px;

    .dialogs {
      margin-top: 15px;
      min-height: 300px;
      max-height: 800px;
      overflow-y: auto;
      background-color: #eee;
      border-radius: 4px;

    }
  }
  .red_note{
    border-left: 4px solid #e74c3c;
    padding: 20px;
    background: #eeeeee;
    color: #e74c3c;
    margin-top: 20px;
  }
</style>
