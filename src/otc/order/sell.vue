<template>
  <div class="order-list">
    <div class="order-list-content">
      <p><span class="numer">{{$t('otc_exchange.otc_exchange_order_number')}}：
        <!--订单编号-->{{item.order_number}}</span></p>
      <ul class="step">
        <li :class="{active:step>=0, current:step===0}">
          1.{{$t('public0.public143')}}
          <!--新建交易-->
        </li>
        <li :class="{active:step>=1, current:step===1}">
          2.{{$t('public0.public150')}}
          <!--等待付款-->
        </li>
        <li :class="{active:step>=2, current:step===2}">
          3.{{$t('otc_ad.otc_ad_prompt8')}}
          <!--释放货币-->
        </li>
        <li :class="{active:step>=3, current:step===3}">
          4.{{$t('public0.public146')}}
          <!--完成交易-->
        </li>
      </ul>
      <div v-html="$t('gcox_otc.order_sell').format(item.symbol_count, item.symbol)"></div>
      <div>
        <div class="tab">
          <table width="100%">
            <tr bgcolor="#eeeeee">
              <td colspan="2" align="center">{{$t('otc_ad.otc_order_details')}}</td>
            </tr>
            <tr>
              <td width="30%">{{$t('public0.public148')}}</td>
              <td><b>{{item.to_user_name}}</b></td>
            </tr>
            <tr>
              <td>{{$t('otc_exchange.otc_exchange_ask')}}</td>
              <td>{{item.cur_price}} {{item.currency}}</td>
            </tr>
            <tr>
              <td>{{$t('exchange.exchange_amount')}}</td>
              <td>{{item.symbol_count}} {{item.symbol}}</td>
            </tr>
            <tr>
              <td>{{$t('gcox_otc.total')}}</td>
              <td><span class="red">{{item.currency_count}}</span> <b>{{item.currency}}</b></td>
            </tr>
            <tr>
              <td>{{$t('otc_ad.otc_ad_status')}}</td>
              <td>

                <span class="gray_button mr20" v-if="step === 2">{{$t('public0.public154')}}</span>
                <span class="gray_button mr20" v-if="step>2">{{$t('otc_ad.otc_ad_completed')}}</span>
                <span class="green_button" v-if="step <= 2">{{stateTitle}}</span>
              </td>
            </tr>
          </table>
        </div>
        <div class="tab" v-if="step!==3">
          <table width="100%">
            <tr bgcolor="#eeeeee">
              <td colspan="2" align="center">{{$t('otc_ad.otc_pay_details')}}</td>
            </tr>
            <tr>
              <td width="30%">{{$t('otc_ad.pay_method')}}</td>
              <td>{{$t(payInfo.method)}}</td>
            </tr>
            <tr>
              <td>{{$t('otc_ad.payer')}}</td>
              <td>{{payInfo.name||'--'}}</td>
            </tr>
            <tr >
              <td>{{$t('otc_legal.otc_legal_Bank')}}</td>
              <td>{{payInfo.bank}}</td>
            </tr>
            <tr>
              <td>{{$t(payInfo.accountName)}}</td>
              <td>{{payInfo.number}}</td>
            </tr>
          </table>
        </div>
        <div class="countdown"  v-if="step ===1">
          <span class="title">{{$t('public0.public62')}}<!--剩余支付时间--></span>
          <span class="timer">{{surplus_Time}}</span>
        </div>
        <p class="mt20 pl20"  v-if="step===1">{{$t('otc_ad.pay_time_expired_tip')}}<!-- 当付款时间过期是交易会被取消，我们将把资金退还给卖家 --></p>
      </div>

    </div>
    <!--<div class="undone-center" v-if="item.state === 1">-->
    <!--<div class="undone-center-sells">-->
    <!--<p>{{$t('otc_exchange.otc_exchange_sell')}}</p>-->
    <!--<p>{{item.symbol}}</p>-->
    <!--</div>-->
    <!--<div class="undone-center-number">-->
    <!--<p class="undone-center-number-font">{{item.total_price}} {{item.currency}}</p>-->
    <!--<p>{{$t(params.ad_type==2?'otc_exchange.otc_exchange_ask':'otc_exchange.otc_exchange_bid')}}-->
    <!--&lt;!&ndash;单价&ndash;&gt;{{item.cur_price}} {{item.currency}}</p>-->
    <!--<p>{{$t('exchange.exchange_amount')}} {{item.symbol_count}} {{item.symbol}}</p>-->
    <!--</div>-->
    <!--<div class="undone-center-type">-->
    <!--<p>{{payTypeTitle}}</p>-->
    <!--</div>-->
    <!--<div class="undone-center-adress">-->
    <!--<p>{{$t('public0.public28')}}&lt;!&ndash;耐心等待买家付款&ndash;&gt;</p>-->
    <!--<p>{{$t('public0.public29')}}&lt;!&ndash;确认付款后，请尽快放币&ndash;&gt;</p>-->
    <!--</div>-->
    <!--</div>-->
    <div class="undone-center" v-if="item.state === 2">
      <!--<div class="undone-center-sells">-->
        <!--<p>{{$t('otc_exchange.otc_exchange_sell')}}</p>-->
        <!--<p>{{item.symbol}}</p>-->
      <!--</div>-->
      <div class="undone-center-type" v-if="!item.to_user_comment">

      </div>
      <div class="undone-center-adress ui-flex">
        <span class="">{{$t('otc_ad.otc_ad_prompt9')}}</span>
        <div class="evaluate ui-flex-1 ml60">
          <ul>
            <li @click="commentType=1" v-if="!item.to_user_comment || item.to_user_comment === 1">
              <em class="myicon-praise" :class="{active:commentType===1}"></em>
              <span>{{$t('otc_ad.otc_ad_Praise')}}<!--好评--></span>
            </li>
            <li @click="commentType=2" v-if="!item.to_user_comment ||item.to_user_comment === 2">
              <em class="myicon-average" :class="{active:commentType===2}"></em>
              <span>{{$t('otc_ad.otc_ad_Average')}}<!--中评--></span>
            </li>
            <li @click="commentType=3" v-if="!item.to_user_comment || item.to_user_comment === 3">
              <em class="myicon-bad-review" :class="{active:commentType===3}"></em>
              <span>{{$t('otc_ad.otc_ad_Bad_review')}}<!--差评--></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="btn_box">
      <a href="javascript:;" v-if="item.state === 1"
         :class="{disabled:item.state === 1 && item.pay_state === 0}"
         @click="confirm">{{$t('otc_ad.otc_ad_prompt8')}}<!--释放货币--></a>
      <a href="javascript:;" v-if="item.state === 2"
         :class="{disabled:item.to_user_comment}" @click="evaluation">{{$t('otc_ad.otc_ad_confirm')}}<!--确认--></a>
      <a href="javascript:;" v-if="item.appeal_state !== 0" @click="apeal(item)">{{$t('otc_exchange.otc_exchange_complaint')}}<!--发起申诉--></a>
      <a href="javascript:;" @click="cancelApeal(item)" v-else>{{$t('public0.public208')}}<!--取消申诉--></a>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'
  import appeal from '@/otc/otchome/appeal'

  export default {
    props: ['item', 'timer'],
    data () {
      return {
        datas: [],
        commentType: 1,
        params: {
          page: 1,
          state: 1,
          total: 0
        },
        intervals: [],
        surplus_Time: null,
        payTypes: {
          real_name: '',
          data: {}
        },
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getUserInfo']),
      paramsChange () {
        return {
          page: this.params.page,
          state: this.params.state
        }
      },
      step () {
        if (this.item.state === 1 && this.item.pay_state === 0) {
          return 1 // 未付款
        } else if (this.item.state === 1 && this.item.pay_state === 1) {
          return 2 // 已付款
        } else if (this.item.state === 2) {
          return 3 // 已放币，交易完成
        } else {
          return 0
        }
      },
      payTypeTitle () {
        if (this.item.pay_type === 1) {
          return this.$t('otc_ad.otc_ad_BankPay')
        } else if (this.item.pay_type === 2) {
          return this.$t('otc_ad.otc_ad_Alipay_pay')
        } else if (this.item.pay_type === 3) {
          return this.$t('otc_ad.otc_ad_WeChatPay')
        } else {
          return null
        }
      },
      stateTitle () {
        if (this.item.state === 2) {
          return this.$t('public0.public146')
        } else if (this.item.pay_state === 0) {
          return this.$t('public0.public152')
        } else if (this.item.pay_state === 1) {
          return this.$t('public0.public145')
        } else {
          return null
        }
      },
      payInfo () {
        let key = Number(this.item.pay_type)===0 ? 1 : Number(this.item.pay_type)
        switch (key) {
          case 1:
            return { // 银行卡
              method: 'otc_ad.otc_ad_BankPay',
              accountName: 'otc_legal.otc_legal_Bank_number',
              name: this.payTypes.data.card_name,
              bank: this.payTypes.data.card_bank,
              number: this.payTypes.data.card_number
            }
          case 2:
            return { // 支付宝
              method: 'otc_ad.otc_ad_Alipay_pay',
              accountName: 'otc_legal.otc_legal_Alipay_number',
              name: this.payTypes.real_name,
              number: this.payTypes.data.alipay_number,
            }
          case 3:
            return { // 微信
              method: 'otc_ad.otc_ad_WeChatPay',
              accountName: 'otc_legal.otc_legal_Wechat_number',
              name: this.payTypes.real_name,
              number: this.payTypes.data.wechat_number,
            }
          case 4:
            return { // PayPal
              method: 'otc_ad.otc_ad_PayPal',
              accountName: 'public0.public221',
              name: this.payTypes.real_name,
              number: this.payTypes.data.paypal_number
            }
          default:
            return {}
        }
      },
    },
    watch:{
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
      this.time()
      this.getPays()
    },
    methods: {
      ...mapActions(['tiggerEvents']),
      apeal (item) { // 发起申诉
        utils.setDialog(appeal, {
          orderNumber: item.order_number,
          okCallback: () => {
            this.$parent.getData()
          }
        })
      },
      cancelApeal (item) { // 取消申诉
        otcApi.cancelAppeal(item.appeal_manage_id, (msg) => {
          this.$parent.getData()
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      getPays () {
        otcApi.getPaySettingsNoToken({
          user_id: this.item.to_user_id
        }, (res) => {
          this.payTypes = {
            real_name: res.real_name,
            data: res.data
          }
        })
      },
      time () {
        this.intervals.forEach((interval) => {
          clearInterval(interval)
        })
        this.intervals = []

        let date = utils.formatDate(this.item.apply_time).getTime()
        let ndate = utils.formatDate(this.timer).getTime()
        let diffTime = Math.floor((ndate - date) / 1000)
        let surplusTime = this.item.pay_apply_time * 60 - diffTime
        let interval = utils.countDown(surplusTime, (time) => {
          if (time === '00:00') {

          } else if (time === '05:00' && this.item.pay_state === 0) {
            // 您的付款确认时间还剩5分钟，5分钟后系统将自动取消订单！请付款并标记确认付款！
            Vue.$confirmDialog({
              id: 'count_down_tip',
              showCancel: false,
              content: this.$t('error_code.PAYMENT_TIMEOUT_REMIND')
            })
            // 添加系统消息
            this.$emit('addSystemMessage', this.item.order_number, 'PAYMENT_TIMEOUT_REMIND')
          }
          this.surplus_Time = time
        })

        this.intervals.push(interval)
      },
      confirm () {
        if (this.item.state === 1 && this.item.pay_state === 0) {
          return
        }
        Vue.$confirmDialog({
          color: '#e53f3f',
          title: this.$t('otc_ad.otc_ad_confirm'),
          content: this.$t('public0.public288'),
          autoClose: true,
          okCallback: () => {
            Vue.$confirmDialog({
              color: '#e53f3f',
              title: this.$t('otc_ad.otc_ad_confirm'),
              content: this.$t('public0.public289'),
              autoClose: true,
              okCallback: () => {
                otcApi.finishOrder(this.item.order_id, (msg) => {
                  this.item.state = 2
                  this.tiggerEvents({
                    name: 'chatEvent',
                    params: {
                      type: 'markReadOnly',
                      orderNumber: this.item.order_number
                    }
                  })
                  this.tiggerEvents({
                    name: 'updateWallet'
                  })
                  this.tiggerEvents({
                    name: 'updateMyAds'
                  })
                  Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
                }, (msg) => {
                  Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
                })
              }
            })
          }
        })
      },
      evaluation () { // 评价
        if (!this.item.order_id || this.item.to_user_comment) {
          return
        }
        otcApi.commentOrder(this.item.order_id, {
          comment_type: this.commentType
        }, (msg) => {
          this.item.to_user_comment = this.commentType
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      goCancelList () {
        this.$router.push({name: 'control_deal', params: {'ip': 3}})
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
        &:after {display: none;}
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

    & > a {
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
      &.default {
        border-color:#666;
        background-color: #fff;
        color:#333 !important;
      }

      &.disabled {
        background: #c7c7c7;
        cursor: no-drop;
      }
    }
  }

  .undone-center-adress {
    height: 60px;
    line-height: 60px;
    padding-left: 16px;
    background-color: #eee;
    border-left: 4px solid #E65656;
    margin-top: 20px;
  }
  .evaluate{
    ul{
      display: flex;
      li{
        margin: 0 20px;
        text-align: center;
        cursor: pointer;
        .active{
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
    padding-left: 16px;
    background-color: #eee;
    border-left: 4px solid #E65656;
    font-size: 18px;
    margin-top: 20px;
    position: relative;
    text-align: center;
    .timer {font-size: 48px;}
    .title {
      position: absolute;
      left: 16px;
      top: 0;
      bottom:0;
    }
  }
</style>
