<template>
  <div>
    <p><img src="../../assets/img/sell.png"><span>{{$t('exchange.exchange_sell')}}</span> {{params.symbol}}：</p>
    <p class="row_box">
      <span>{{$t('exchange.exchange_price')}}({{getCurrency}})</span>
      <span>
        <img v-show="load" src="../../assets/img/load.svg" width="20"/>
        <i class="red">{{price}}</i> {{getCurrency}}
      </span>
    </p>
    <p class="row_box">
      <span>{{$t('home.home40')}}({{params.symbol}})</span>
      <span><numberbox :accuracy="8" v-model="amount"></numberbox></span>
    </p>
    <button @click="sub()"
            :class="disabled">{{$t('gcox_otc.now_sell')}}
    </button>
  </div>
</template>

<script>
  import otcApi from '@/api/otc'
  import Numberbox from '../../components/formel/numberbox'
  import Vue from 'vue'
  import {mapGetters} from 'vuex'

  export default {
    components: {Numberbox},
    props: ['params', 'sellCur'],
    data () {
      return {
        amount: null,
        noAd: null,
        timeout: false,
        listAdv: {},
        t: this.params,
        load: false
      }
    },
    computed: {
      ...mapGetters(['getLang', 'getSymbol', 'getCurrency', 'getUserInfo', 'getApiToken', 'isLogin']),
      price () {
        if (!this.amount) {
          return this.sellCur
        } else {
          return this.listAdv.cur_price || (this.noAd ? this.$t(`error_code.${this.noAd}`) : null)
        }
      },
      form () {
        return {
          amount: this.amount,
          currency: this.getCurrency,
          symbol: this.params.symbol,
          direction: 2
        }
      },
      disabled () {
        if (this.amount) {
          return this.listAdv.cur_price ? '' : 'disabled'
        } else {
          return 'disabled'
        }
      }
    },
    watch: {
      amount (e) {
        if (e) {
          this.timeout = false
          this.load = true
          this.listAdv.cur_price = null
          this.noAd = null
          setTimeout(() => {
            this.timeout = true
          }, 800)
        }
      },
      timeout (e) {
        console.log('timeout' + e)
        if (e) {
          // if (this.isLogin) {
          this.getAdv()
          // } else {
          //   Vue.$confirmDialog({
          //     id: 'login',
          //     showCancel: false,
          //     content: this.$t('public0.public15'), // 请登录后再交易
          //     okCallback: () => {
          //       this.$router.push({name: 'login'})
          //     }
          //   })
          // }
        }
      },
      params () {
        this.emit()
      },
      getCurrency () {
        this.emit()
      }
    },
    created () {

    },
    methods: {
      emit () {
        this.amount = null
        this.noAd = null
        this.timeout = false
        this.listAdv = {}
      },
      getAdv () {
        this.load = true
        otcApi.match(this.form, (res) => {
          this.listAdv = res
          this.load = false
        }, msg => {
          this.noAd = msg
          this.load = false
        })
      },
      sub () {
        if (this.amount) {
          if (this.listAdv.cur_price) {
            let isCheckPaySet = true
            this.matchPayType = this.listAdv.pay_type
            console.log(this.listAdv.from_user_id, this.getUserInfo.userId)
            let p = {
              adType: 2,
              role: 'Taker'
            }
            this.checkSetState(p, () => {
              if (this.getUserInfo.userId === this.listAdv.from_user_id) {
                // 不可以买卖自己发布的广告
                Vue.$koallTipBox({icon: 'notification', message: this.$t(`gcox_otc.not_buy_myself`)})
                return
              }

              window.localStorage.amount = this.amount

              let query = {ad_id: this.listAdv.ad_id, params: this.listAdv, matchPayType: this.matchPayType}
              window.localStorage.ordDet = JSON.stringify(query)
              this.$router.push({
                name: 'transaction',
              })
            }, 'public0.public15', isCheckPaySet, true, this.listAdv.ad_id)
          }
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`exchange.exchange_number_empty`)})
        }
      },
      checkSetState (p, successCallback, message, isCheckPaySet, isCheckPayType, id) {
        if (!this.getApiToken) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(message)}) // 请登录后再发布广告||请登录后再交易
          return
        }
        if (!this.getUserInfo.mobile) {
          Vue.$confirmDialog({
            id: 'bind_mobile',
            content: this.$t('gcox_otc.bind_mobile'), // 请先绑定手机号
            okCallback: () => {
              this.$router.push({name: 'usercenter_abstract'})
            }
          })
          return
        }
        otcApi.permission(p, (msg) => {
          if (isCheckPaySet) {
            otcApi.getPaySettings((res) => {
              if (isCheckPayType) {
                otcApi.matchPayTypes(id, (data2) => {
                  this.matchPayType = data2
                  successCallback && successCallback()
                }, (msg3) => {
                  if (msg3 === 'PAY_TYPE_UNMATCH') {
                    Vue.$confirmDialog({
                      id: 'PAY_TYPE_UNMATCH',
                      content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
                      okCallback: () => {
                        this.$router.push({name: 'control_pay'})
                      }
                    })
                  } else {
                    Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg3}`)})
                  }
                })
              } else {
                successCallback && successCallback(res.data.pay_type)
              }
            }, (res) => {
              if (res.msg === 'NO_PAY_TYPE') {
                Vue.$confirmDialog({
                  id: 'NO_PAY_TYPE',
                  content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
                  okCallback: () => {
                    this.$router.push({name: 'control_pay'})
                  }
                })
              } else {
                Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
              }
            })
          } else {
            successCallback && successCallback()
          }
        }, (msg) => {
          if (msg === 'KYC_AUTH_FIRST') {
            Vue.$confirmDialog({
              id: 'KYC_AUTH_FIRST',
              content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
              okCallback: () => {
                this.$router.push({name: 'control_kyc'})
              }
            })
          } else {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  div {

    p {
      font-size: 18px;

      span {
        padding-left: 8px;
      }
    }

    h4 {
      font-size: 24px;
      margin: 15px 0;
      font-weight: 400;
    }

    .row_box {
      line-height: 32px;
      margin-top: 1vh;
      display: flex;

      span {
        &:first-child {
          width: 135px;
        }

        &:last-child {
          flex: 1;

          input {
            border: 1px solid #303166;
            background: transparent;
            border-radius: 4px;
            width: 100%;
            height: 40px;
            text-indent: 10px;
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            padding: 0;

            &:focus {
              border: 1px solid #F0B936 !important;
            }
          }
        }

        padding-left: 0;
      }
    }

    button {
      margin-top: 2vh;
      height: 50px;
      width: 100%;
      background: #E65656;
      border-radius: 4px;
      padding: 0;
      font-size: 18px;
      color: #ffffff;

      &.disabled {
        background: #1F2048;
        cursor: no-drop;
        color: #999999;
      }
    }
  }
</style>
