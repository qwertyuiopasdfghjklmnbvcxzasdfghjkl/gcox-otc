<template>
  <div class="warm">
    <div class="top">
      <p class="w1200">{{$t('gcox_otc.get_cny_in_china')}}</p>
    </div>
    <div class="buy">
      <div class="buy-cont">
        <!--<p>-->
        <!--<span class="label-left">{{$t(params.ad_type==2?'otc_exchange.otc_exchange_ask':'otc_exchange.otc_exchange_bid')}}-->
        <!--&lt;!&ndash;单价&ndash;&gt;</span>-->
        <!--<span>{{detailData.cur_price}}<em class="unit">&nbsp;{{params.currency}}</em></span>-->
        <!--</p>-->
        <!--<p>-->
        <!--<span class="label-left">{{$t('message.msg_surplus')}}&lt;!&ndash;剩余&ndash;&gt;</span>-->
        <!--<span>{{detailData.remain_count}}<em class="unit">&nbsp;{{params.symbol}}</em></span>-->
        <!--</p>-->
        <!--<p>-->
        <!--<span class="label-left">{{$t('otc_exchange.otc_exchange_Trading_limits')}}&lt;!&ndash;交易限额&ndash;&gt;</span>-->
        <!--<span class="trade-limit"><em>{{detailData.min_amount}} - {{detailData.max_amount}}</em><em class="unit">&nbsp;{{tradeParams.limit}}</em></span>-->
        <!--</p>-->
        <div>
          <p>
            <span class="label-left">{{$t('exchange.exchange_amount')}}<!--数量--><em class="asterisk">&nbsp;*</em></span>
            <span><em class="unit">&nbsp;{{params.symbol}}</em></span>
          </p>
          <p>
            <numberbox :class="{error: errors.has('symbol_count')}" v-model="symbol_count"
                       v-validate="`required|intOrDecimal|buyOrSellNotLargeRemainCount${sellType ? '|minTradeLimit:1|maxTradeLimit:1' : ''}`"
                       data-vv-name="symbol_count" :accuracy="4"/>
            <small @click="buyAll">Max</small>
          </p>
          <p class="msg">
            {{errors.has('symbol_count')?getErrorMsg('symbol_count'):''}}
          </p>
        </div>
        <div>
          <p>
            <span class="label-left">{{$t('exchange.exchange_total')}}<!--金额--><em class="asterisk">&nbsp;*</em></span>
            <span><em class="unit">&nbsp;{{params.currency}}</em></span>
          </p>
          <p>
            <numberbox :class="{error: errors.has('currency_count')}" v-model="currency_count"
                       v-validate="`required|intOrDecimal${buyType ? '|minTradeLimit:2|maxTradeLimit:2' : ''}`"
                       data-vv-name="currency_count" :accuracy="2"/>
          </p>
          <p class="msg">
            {{errors.has('currency_count')?getErrorMsg('currency_count'):''}}
          </p>
        </div>
      </div>
      <div class="btn">
        <!--<span class="cancel" @click="cancel">{{$t('otc_legal.otc_legal_cancel')}}&lt;!&ndash;取消&ndash;&gt;</span>-->
        <button @click="createOrder" :class="buyType? 'green_button': 'red_button'">
          {{tradeParams.tradeTxt}}{{params.symbol}}
          <!--确认--></button>
      </div>
    </div>
    <div class="box">
      <p class="title">{{$t('gcox_otc.advertising_details')}}</p>
      <table>
        <tr>
          <td>{{$t('gcox_otc.pay_to')}}</td>
          <td>{{params.username}}</td>
        </tr>
        <tr>
          <td>{{$t('exchange.exchange_price')}}</td>
          <td><b><span class="green">{{detailData.cur_price}}</span> {{params.currency}}/{{params.symbol}}</b></td>
        </tr>
        <tr>
          <td>{{$t('gcox_otc.limit_number')}}</td>
          <td><b><span class="radius">{{detailData.min_amount}}{{tradeParams.limit}}</span> - <span class="radius">{{detailData.max_amount}}{{tradeParams.limit}}</span></b>
          </td>
        </tr>
        <tr>
          <td>{{$t('gcox_otc.payment_method')}}</td>
          <td><em class="wechat icon-paypal" :title="$t('public0.public219')"
                  v-if="(params.pay_type||'').indexOf('4')!==-1"> {{$t('otc_ad.otc_ad_PayPal')}}</em><!--PayPal支付-->
            <em class="wechat icon-wechat" :title="$t('otc_ad.otc_ad_WeChatPay')"
                v-if="(params.pay_type||'').indexOf('3')!==-1"> {{$t('otc_ad.otc_ad_WeChatPay')}}</em><!--微信支付-->
            <em class="zfb icon-alipay" :title="$t('otc_ad.otc_ad_Alipay_pay')"
                v-if="(params.pay_type||'').indexOf('2')!==-1"> {{$t('otc_ad.otc_ad_Alipay_pay')}}</em><!--支付宝支付-->
            <em class="card icon-bank" :title="$t('otc_ad.otc_ad_BankPay')"
                v-if="(params.pay_type||'').indexOf('1')!==-1"> {{$t('otc_ad.otc_ad_BankPay')}}</em><!--银行卡支付--></td>
        </tr>
        <tr>
          <td>{{$t('gcox_otc.address')}}</td>
          <td>--</td>
        </tr>
        <tr>
          <td>{{$t('gcox_otc.pay_window')}}</td>
          <td>{{params.pay_limit_time}} {{$t('otc_ad.otc_ad_minute')}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Validator} from 'vee-validate'
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'
  import numUtils from '@/assets/js/numberUtils'
  import numberbox from '@/components/formel/numberInput'
  import orderconfirm from '@/otc/otchome/orderconfirm'

  export default {
    // props: ['params', 'ad_id', 'matchPayType'],
    components: {
      numberbox
    },
    data () {
      return {
        locked: false,
        detailData: {},
        symbol_count: '',
        currency_count: '',
        changeInput: '',
        params: {},
        ad_id: null,
        matchPayType: null,
      }
    },
    computed: {
      msgs () {
        return {
          symbol_count: {required: this.$t('public0.public12')}, // 请输入数量
          currency_count: {required: this.$t('public0.public13')} // 请输入金额
        }
      },
      buyType () { // 卖的广告是买
        return this.params.ad_type === 2
      },
      sellType () { // 买的广告是卖
        return this.params.ad_type === 1
      },
      tradeParams () {
        if (this.buyType) {
          return {
            tradeTxt: this.$t('otc_exchange.otc_exchange_buy'), // 购买
            limit: this.params.currency // 交易限额
          }
        } else if (this.sellType) {
          return {
            tradeTxt: this.$t('otc_exchange.otc_exchange_sell'), // 出售
            limit: this.params.symbol // 交易限额
          }
        } else {
          return {}
        }
      }
    },
    watch: {
      currency_count (val, oldVal) {
        if (numUtils.BN(val).equals(numUtils.BN(0)) || this.changeInput === 'symbol') {
          this.changeInput = ''
          return
        }
        this.changeInput = 'currency'
        this.symbol_count = val ? utils.removeEndZero(numUtils.div(val, this.detailData.cur_price).toFixed(5)) : ''
      },
      symbol_count (val, oldVal) {
        if (numUtils.BN(val).equals(numUtils.BN(0)) || this.changeInput === 'currency') {
          this.changeInput = ''
          return
        }
        this.changeInput = 'symbol'
        this.currency_count = val ? utils.removeEndZero(numUtils.mul(val, this.detailData.cur_price).toFixed(2)) : ''
      }
    },
    created () {
      let ordDet = JSON.parse(window.localStorage.ordDet)
      this.params = ordDet.params
      this.ad_id = ordDet.ad_id
      this.matchPayType = ordDet.matchPayType

      console.log(this.params, this.ad_id, this.matchPayType)

      Validator.extend('minTradeLimit', {
        getMessage: (field, args) => 'error_code.ORDER_TRADE_LT_COUNT',
        validate: (value, args) => {
          return parseFloat(value) >= parseFloat(this.detailData.min_amount)
        }
      })
      Validator.extend('maxTradeLimit', {
        getMessage: (field, args) => 'error_code.ORDER_TRADE_GT_COUNT',
        validate: (value, args) => {
          return parseFloat(value) <= parseFloat(this.detailData.max_amount)
        }
      })
      Validator.extend('buyOrSellNotLargeRemainCount', {
        getMessage: (field, args) => 'error_code.SYMBOL_AD_REMAIN_LACK',
        validate: (value, args) => {
          return parseFloat(value) <= parseFloat(this.detailData.remain_count)
        }
      })
      this.fnGetAdvertisementDetail()
    },
    methods: {
      fnGetAdvertisementDetail () {
        otcApi.getAdvertisementDetail(this.ad_id, (res) => {
          this.detailData = res || {}
          this.detailData.cur_price = utils.removeEndZero(numUtils.BN(this.detailData.cur_price).toFixed(2))
          this.detailData.min_amount = utils.removeEndZero(numUtils.BN(this.detailData.min_amount).toFixed(8))
          this.detailData.max_amount = utils.removeEndZero(numUtils.BN(this.detailData.max_amount).toFixed(8))
          this.detailData.remain_count = utils.removeEndZero(numUtils.BN(this.detailData.remain_count).toFixed(8))
        })
      },
      buyAll () {
        if (this.buyType) {
          if (numUtils.mul(this.detailData.remain_count, this.detailData.cur_price).gt(numUtils.BN(this.detailData.max_amount))) {
            this.currency_count = this.detailData.max_amount
          } else {
            this.symbol_count = this.detailData ? this.detailData.remain_count : 0
          }
        } else if (this.sellType) {
          if (numUtils.BN(this.detailData.remain_count).gt(numUtils.BN(this.detailData.max_amount))) {
            this.symbol_count = this.detailData.max_amount
          } else {
            this.symbol_count = this.detailData ? this.detailData.remain_count : 0
          }
        }
      },
      cancel () {
        this.$emit('removeDialog')
      },
      createOrder () {
        this.$validator.validateAll().then((valid) => {
          if (!valid) {
            return
          }
          Vue.$confirmDialog({
            id: 'create_order_confirm',
            title: this.$t('public0.public255'), // 下单确认信息
            isComponent: true,
            content: orderconfirm,
            btnPosition: 'right',
            width: 620,
            item: {
              trade_type: this.params.ad_type === 1 ? 2 : 1,
              cur_price: this.detailData.cur_price,
              symbol: this.detailData.symbol,
              currency: this.detailData.currency,
              symbol_count: this.symbol_count,
              currency_count: this.currency_count,
              pay_type: this.detailData.pay_type,
              matchPayType: this.matchPayType
            },
            okCallback: () => {
              if (this.locked) {
                return
              }
              this.locked = true
              otcApi.createOrders({
                ad_id: this.ad_id,
                trade_type: this.params.ad_type === 1 ? 2 : 1,
                symbol: this.detailData.symbol,
                currency: this.detailData.currency,
                symbol_count: this.symbol_count,
                currency_count: this.currency_count
              }, (id, msg) => {
                this.locked = false
                this.params.newOrderCount++
                // this.$emit('okCallback', id)
                this.$router.push({name: 'otc_detail', query: {id: id}})
                Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
                // this.$emit('removeDialog')
              }, (msg) => {
                this.locked = false
                let errMsg = typeof msg === 'string' ? msg : msg[0]
                Vue.$confirmDialog({showCancel: false, content: this.$t(`error_code.${errMsg}`)})
              })
            }
          })
        })
      },
      getErrorMsg (name) {
        return this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
      }
    }
  }
</script>

<style scoped lang="less">
  .top {
    height: 120px;
    background: #13143A;
    overflow: auto;

    p {
      color: #ffffff;
      font-size: 24px;
      margin-top: 45px;
    }
  }

  .cont {
    width: 500px;
    margin: 30px auto;
    border-bottom: 1px solid #eeeeee;
    padding: 20px;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;

    div {
      width: 190px;
      font-size: 16px;
      color: #333333;

      p {
        margin: 10px 0;
      }

      input {
        padding: 15px 10px;
        border: 1px solid #eeeeee;
        border-radius: 4px;
      }

      small {
        padding-top: 6px;
        font-size: 14px;
      }

      label {
        position: relative;
        display: block;

        span {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 50px;
          height: 42px;
          background: #13143A;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 2px;
          color: #ffffff;
        }
      }

      button {
        width: 190px;
        height: 50px;
        border-radius: 3px;
        color: #ffffff;
        margin-top: 40px;
      }
    }
  }

  .box {
    width: 540px;
    margin: 30px auto;

    .title {
      background: #13143A;
      text-align: center;
      line-height: 50px;
      color: #ffffff;
    }

    table {
      width: 540px;

      td {
        border: 1px solid #eeeeee;
        padding: 15px;
      }
    }
  }

  .radius {
    border-radius: 15px;
    background: #F0B936;
    color: #ffffff;
    padding: 2px 6px;
  }

  .buy {
    width: 500px;
    padding: 20px;
    margin: 20px auto;
    border-bottom: 1px solid #eeeeee;

    .buy-cont {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;

      div {
        width: 220px;
        font-size: 16px;

        p {
          margin: 10px 0;
          position: relative;

          small {
            position: absolute;
            width: 50px;
            height: 44px;
            background: rgba(19, 20, 58, 1);
            border-radius: 2px;
            color: #ffffff;
            font-size: 16px;
            display: inline-block;
            text-align: center;
            line-height: 44px;
            top: 4px;
            right: 23px;
            cursor: pointer;
          }
        }

        input {
          padding: 15px;
          height: 20px;
          border: 1px solid #eeeeee;
        }
      }
    }
  }

  .btn {
    text-align: right;
    padding-right: 40px;
    margin-top: 40px;

    button {
      width: 190px;
      height: 50px;
      color: #ffffff;
      font-size: 16px;
      border-radius: 3px;
    }
  }
  .msg{
    color: #e74c3c;
  }
</style>
