<template>
  <div class="cont" @click="show=false">
    <div class="w1200">

      <div class="select">
        <p @click.stop="show=!show">
          <cryptoicon :symbol="t.symbol" size="40"/>
          <span>{{t.caption}}</span>
          <i></i>
        </p>
        <ul v-if="show">
          <li v-for="item in ts" @click="change(item)">
            <p>
              <cryptoicon :symbol="item.symbol" size="40"/>
              <span>{{item.caption}}</span>
            </p>
          </li>
        </ul>
      </div>

      <div class="box" v-if="state === 0">
        <div class="left-box">
          <p><img src="../../assets/img/buy.png"><span>{{$t('gcox_otc.sell_price')}}</span></p>
          <h4><span class="green">{{curPrice}}</span> {{params.currency}}</h4>
          <button @click="state=1">{{$t('gcox_otc.now_buy')}}</button>
        </div>
        <div class="right-box">
          <p><img src="../../assets/img/sell.png"><span>{{$t('gcox_otc.buy_price')}}</span></p>
          <h4><span class="red">{{curPrice}}</span> {{params.currency}}</h4>
          <button @click="state=2">{{$t('gcox_otc.now_sell')}}</button>
        </div>
      </div>

      <div class="buy_box" v-if="state !== 0">
        <div class="input_box">
          <span>
            <numberbox :accuracy="8" v-model="amount"></numberbox>
            <button v-if="state === 2" @click="getMax()">Max</button>
          </span>
          <span>
            <select class="w250" v-model="price">
              <option :key="listAdv.cur_price" :value="listAdv.cur_price">
              {{listAdv.cur_price}}
              </option>
            </select>
          </span>
        </div>
        <button :class="state === 1 ? 'yellow_button': 'red_button'" @click="sub()">Create offer</button>
        <p v-if="state === 1" @click="state=2">{{$t('gcox_otc.want').format($t('gcox_otc.sell'))}}{{t.symbol}} ?</p>
        <p v-if="state === 2" @click="state=1">{{$t('gcox_otc.want').format($t('gcox_otc.buy'))}}{{t.symbol}} ?</p>
      </div>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Inputbox from '../../components/formel/inputbox'
  import Numberbox from '../../components/formel/numberbox'
  import otcApi from '@/api/otc'
  import numUtils from '@/assets/js/numberUtils'
  import {mapGetters, mapActions} from 'vuex'
  import numberUtils from '../../assets/js/numberUtils'

  export default {
    name: 'select-index',
    components: {Numberbox, Inputbox},
    props: ['params'],
    data () {
      return {
        show: false,
        state: 0,
        t: this.params,
        ts: [],
        curPrice: 0,
        curList: window.localStorage.currencyList,
        amount: null,
        listAdv: {}
      }
    },
    computed: {
      ...mapGetters(['getLang', 'getSymbol', 'getCurrency', 'getUserInfo', 'getApiToken']),
      paramsChange () {
        return {
          currency: this.params.currency,
          symbol: this.t.symbol
        }
      },
      form () {
        return {
          amount: this.amount,
          currency: this.params.currency,
          symbol: this.params.symbol,
          direction: this.state
        }
      },
      price () {
        return this.listAdv.cur_price
      }
    },
    watch: {
      amount () {
        this.getAdv()
      }
    },
    created () {
      this.getList()
      this.getInfo()
      this.$nextTick(() => {
        this.fnGetBenchExchange()
      })
    },
    methods: {
      change (data) {
        this.show = false
        this.t = data
        this.t.currency = this.params.currency
        this.getInfo()
        this.$emit('change', this.t)
      },
      getList () {
        otcApi.getCoinsList(res => {
          this.ts = res
        })
      },
      getInfo () {
        otcApi.getCoinMarket(this.paramsChange, res => {
          this.curPrice = numUtils.BN(res[0].price).toFixed(6)
          console.log(res)
        })
      },
      sub () {
        if (this.form.amount && this.price) {
          let isCheckPaySet = parseInt(this.state) === 1
          this.matchPayType = parseInt(this.state) === 1 ? void 0 : this.listAdv.pay_type
          console.log(this.listAdv.from_user_id, this.getUserInfo.userId)
          this.checkSetState(() => {
            if (this.getUserInfo.userId === this.listAdv.from_user_id) {
              // 不可以买卖自己发布的广告
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`gcox_otc.not_buy_myself`)})
              return
            }
            let query = {ad_id: this.listAdv.ad_id, params: this.listAdv, matchPayType: this.matchPayType}
            window.localStorage.ordDet = JSON.stringify(query)
            this.$router.push({
              name: 'transaction',
            })
          }, 'public0.public15', isCheckPaySet, true, this.listAdv.ad_id)
        }
      },
      getAdv () {
        otcApi.match(this.form, res => {
          this.listAdv = res
        })
      },
      getMax () {
        this.amount = this.getSymbol.totalBalance || 0
      },
      fnGetBenchExchange () { // 获取对标交易所
        otcApi.getBenchExchange((res) => {
          this.benchDatas = res
        })
      },

      checkSetState (successCallback, message, isCheckPaySet, isCheckPayType, id) {
        if (!this.getApiToken) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(message)}) // 请登录后再发布广告||请登录后再交易
          return
        }
        otcApi.getVerifyState((msg) => {
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
                      content: this.$t('error_code.PAY_TYPE_UNMATCH'), // 支付方式不匹配，请设置对应的支付方式
                      okCallback: () => {
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
  .cont {
    height: calc(~'100vh - 100px');
    min-height: 440px;
    background: #13143A;
    overflow: auto;
  }

  .select {
    width: 930px;
    margin: 0 auto;
    margin-top: 20vh;
    position: relative;
    display: flex;
    height: 70px;

    & > p {
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
    }

    p {
      display: flex;
      align-items: center;
      color: #333;
      font-size: 18px;
      width: 100%;
      padding-left: 10px;

      img {
        width: 40px;
        margin: 0 16px;
      }

      span {
        /*padding: 10px;*/
        display: block;
        flex: 1;
        padding-left: 16px;
      }

      i {
        display: flex;
        width: 60px;
        height: 70px;
        background: url("./../../assets/img/down.png") no-repeat center #F0B936;
      }
    }

    ul {
      position: fixed;
      left: 50%;
      margin-left: -465px;
      top: 20vh;
      background: rgba(255, 255, 255, 1);
      display: block;
      width: 930px;
      z-index: 99;

      li {
        display: flex;
        padding: 10px 0;
        cursor: pointer;
        transition: 0.3s;
        border-bottom: 1px solid #9ca1a4;

        &:hover {
          background: #ebfbfb;
        }
      }
    }
  }

  .box {
    width: 930px;
    margin: 0 auto;
    margin-top: 58px;
    position: relative;
    display: flex;
    height: 190px;
    justify-content: space-between;
    color: #ffffff;

    div {
      width: 390px;
      background: #1A1B42;
      border-radius: 6px;
      padding: 26px;

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

      button {
        width: 124px;
        height: 60px;
        background: rgba(41, 157, 130, 1);
        border-radius: 4px;
        padding: 0;
        font-size: 18px;
        color: #ffffff;
      }
    }

    .right-box {
      button {
        background: #E65656;
      }
    }
  }

  .buy_box {
    width: 930px;
    margin: 20px auto;
    margin-top: 70px;

    button {
      width: 930px;
      height: 60px;
      border-radius: 6px;
      color: #ffffff;
      font-size: 18px;
      margin-top: 70px;
    }

    p {
      font-size: 16px;
      color: #ffffff;
      line-height: 24px;
      padding: 10px 0;
      cursor: pointer;
      display: inline-block;
      transition: 0.3s;

      &:hover {
        color: #F0B936;
      }
    }
  }

  .input_box {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      width: 49%;
      background: #ffffff;
      border-radius: 6px;
      height: 60px;
      display: flex;
      overflow: hidden;
      justify-content: space-between;
      align-items: center;

      input {
        flex: 1;
        padding: 10px;
        font-size: 18px;
        height: 40px;
      }

      button {
        width: 60px;
        height: 54px;
        margin: 3px;
        border-radius: 4px;
        background: #13143A;
      }

      select {
        flex: 1;
        height: 60px;
        padding: 0 20px;
        font-weight: 600;
        margin-right: 10px;
      }
    }
  }
</style>
