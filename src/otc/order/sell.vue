<template>
  <div class="order-list">
    <div class="order-list-content">
      <p><span class="numer">{{$t('otc_exchange.otc_exchange_order_number')}}：
        <!--订单编号-->{{item.order_number}}</span></p>
      <ul class="step">
        <li :class="{active:step>=0}">
          1.{{$t('public0.public143')}}
          <!--新建交易-->
        </li>
        <li :class="{active:step>=1}">
          2.{{$t('public0.public150')}}
          <!--等待付款-->
        </li>
        <li :class="{active:step>=2}">
          3.{{$t('otc_ad.otc_ad_prompt8')}}
          <!--释放货币-->
        </li>
        <li :class="{active:step>=3}">
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
              <td><span class="red">{{item.total_price}}</span> <b>{{item.currency}}</b></td>
            </tr>
            <tr>
              <td>{{$t('otc_ad.otc_ad_status')}}</td>
              <td><span class="green_button" style="padding: 3px 6px">{{stateTitle}}</span></td>
            </tr>
          </table>
        </div>
        <div class="undone-center-adress" v-if="item.state === 1">
          <p>{{$t('public0.public28')}}<!--耐心等待买家付款--></p>
          <p>{{$t('public0.public29')}}<!--确认付款后，请尽快放币--></p>
        </div>
        <div class="timer" v-if="item.pay_state === 0">
          <span>{{$t('public0.public62')}}</span>
          <b>{{surplus_Time}}</b>
        </div>
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
        {{$t('otc_ad.otc_ad_prompt9')}}
      </div>
      <div class="undone-center-adress">
        <div class="evaluate">
          <ul>
            <li @click="commentType=1" v-if="!item.to_user_comment || item.to_user_comment === 1">
              <em class="icon-praise" :class="{active:commentType===1}"></em>
              <p>{{$t('otc_ad.otc_ad_Praise')}}<!--好评--></p>
            </li>
            <li @click="commentType=2" v-if="!item.to_user_comment ||item.to_user_comment === 2">
              <em class="icon-average" :class="{active:commentType===2}"></em>
              <p>{{$t('otc_ad.otc_ad_Average')}}<!--中评--></p>
            </li>
            <li @click="commentType=3" v-if="!item.to_user_comment || item.to_user_comment === 3">
              <em class="icon-bad-review" :class="{active:commentType===3}"></em>
              <p>{{$t('otc_ad.otc_ad_Bad_review')}}<!--差评--></p>
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
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'

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
        payInfo: {},
        surplus_Time: null,
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
          return this.$t('public0.public150')
        } else if (this.item.pay_state === 1) {
          return this.$t('otc_ad.otc_ad_prompt8')
        } else {
          return null
        }
      }
    },
    created () {
      this.time()
    },
    methods: {
      ...mapActions(['tiggerEvents']),
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
      getPays () {
        otcApi.getPaySettingsNoToken({
          user_id: this.item.from_user_id
        }, (res) => {
          this.payInfo = res.data
        })
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
      }
    }
  }
</script>

<style scoped lang="less">
  .step {
    display: flex;
    align-items: center;
    margin: 20px 0;

    li {
      flex: 1;
      background: #eeeeee;
      padding: 20px;
      color: #666c7d;
      font-size: 18px;
      position: relative;
      margin: 10px;
      text-indent: 20px;

      &.active {
        background: #299D82;
        color: #ffffff;

        &:after {
          background: #299D82;
        }
      }

      &:after {
        content: '';
        width: 30px;
        height: 30px;
        display: block;
        position: absolute;
        right: -23px;
        top: 10px;
        background: #eeeeee;
        border: 8px solid #ffffff;
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

  .timer {
    border-left: 4px #E65656 solid;
    padding: 20px;
    position: relative;
    background: #F6F6F6;
    text-align: center;
    margin: 20px 0;

    b {
      font-size: 48px;
    }

    span {
      position: absolute;
      left: 20px;
      top: 40px;
    }
  }

  .time_text {
    padding: 15px;
  }

  .order-list {
    font-size: 16px;
  }

  .btn_box {
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;

    & > a {
      width: 150px;
      height: 50px;
      display: block;
      text-align: center;
      line-height: 50px;
      margin: 10px;
      border-radius: 3px;
      border: 1px solid #eeeeee;
      background: #F0B936;
      color: #ffffff !important;

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

  .undone-center-type{
    margin: 10px 0;
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
      }
    }
  }
</style>
