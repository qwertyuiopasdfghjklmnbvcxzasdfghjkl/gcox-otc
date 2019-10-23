<template>
  <div class="createorder" :class="{'sell-pend': formData.ad_type === 2}">
    <div class="title">{{$t(ad_id ? 'otc_ad.otc_edit_title' : 'otc_ad.otc_post_title').format(tradeParams.title1,
      formData.symbol)}}<!--发布广告||修改广告--></div>
    <div class="cont">
      <div class="cont-item currency">
        <div class="row">
          <label>{{$t('otc_ad.otc_current_currency')}}：<!--当前法币--></label>
          <div class="value">
            <select class="w250" v-model="formData.currency">
              <option v-for="item in currencyList" :key="item.id" :value="item.currency">
                {{$t(`otc_exchange.otc_exchange_${item.currency}`)}}
              </option>
            </select>
          </div>
        </div>
        <div class="prompt"></div>
      </div>
      <!--<div class="cont-item exchange">-->
      <!--<div class="column">-->
      <!--<label>{{$t('otc_exchange.otc_exchange_Bid')}}：&lt;!&ndash;对标交易所&ndash;&gt;</label>-->
      <!--<div class="value">-->
      <!--<select v-model="formData.bench_marking_id">-->
      <!--<option v-for="item in benchDatas" :key="item.bench_marking_id" :value="item.bench_marking_id">-->
      <!--{{item.marking_name}}-->
      <!--</option>-->
      <!--</select>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="prompt"></div>-->
      <!--</div>-->

      <!--<div class="cont-item currentprice">-->
        <!--<div class="row">-->
          <!--<label>{{$t('otc_ad.otc_ad_prompt1')}}({{formData.currency}})：&lt;!&ndash;交易所价格&ndash;&gt;</label>-->
          <!--<div class="value">-->
            <!--<span>{{benchItem.lowestPrice}}</span>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="prompt"></div>-->
      <!--</div>-->


      <div class="box">
        <p class="title_p">{{$t('exchange.exchange_price')}}</p>
        <div class="cont-item">
          <div class="row">
            <label>{{$t('otc_ad.otc_ad_prompt1')}}({{formData.currency}})<!---交易所价格--></label>
            <div class="value">
              <select class="w250" v-model="formData.bench_marking_id">
                <option v-for="item in benchDatas" :key="item.bench_marking_id" :value="item.bench_marking_id">
                  {{item.marking_name}}
                </option>
              </select>
              <span>{{benchItem.lowestPrice}}</span>
            </div>
            <p class="small">
              <span>{{$t('gcox_otc.redeme').format(formData.currency,formData.symbol)}}</span>
              <span
                v-html="$t('gcox_otc.radio_market').format(formData.symbol,'coinmarketcap',benchItem.lowestPrice)"></span>
            </p>
          </div>
          <div class="prompt"></div>
        </div>

        <div class="cont-item premium" v-if="!isATN">
          <div class="row">
            <label class="label-tips">
              <span>{{$t('otc_ad.otc_ad_Premium')}}<!--溢价--></span>
              <div class="tips">
                <span class="tips-container">
                <i class="tips-icon" v-tip.top="tip1">?</i>
                  <!--对交易所价格的浮动比例-->
                  <!--
                  <em class="tips-text">{{$t('otc_exchange.otc_exchange_price_float_rate')}}</em>
                  -->
                </span>
              </div>
            </label>
            <div class="value">
              <numberbox :class="{error: errors.has('price_rate')}" v-model="formData.price_rate" :size="6" :accuracy="2"
                         v-validate="'premiumPriceValid'" data-vv-name="price_rate"/>
              <em>%</em>
            </div>
          </div>
          <div class="prompt">{{getErrorMsg('price_rate')}}</div>
        </div>

        <div class="cont-item price" v-if="!isATN">
          <div class="row">
            <label>{{$t('otc_exchange.otc_exchange_price')}}<!--溢价后单价--> ({{formData.currency}})</label>
            <div class="value">
              <span>{{curPrice}}</span>
            </div>
          </div>
          <div class="prompt"></div>
        </div>

        <div class="cont-item acceptable" v-if="!isATN">
          <div class="row">
            <label>{{tradeParams.title2}}<!--可接受的最低单价||可接受的最高单价--> ({{formData.currency}})</label>
            <!--<span class="wn">{{benchItem.lowestPrice}} {{formData.currency}}/{{formData.symbol}}</span>-->
            <div class="value">
              <numberbox :class="{error: errors.has('lowest_price')}" v-model="formData.lowest_price" :size="13"
                         :accuracy="2" v-validate="'intOrDecimal|maxInputValue:9999999999'"
                         data-vv-name="lowest_price"/>
            </div>

          </div>
          <div class="prompt">{{getErrorMsg('lowest_price')}}</div>
        </div>
      </div>

      <div class="box">
        <p class="title_p">{{$t('exchange.exchange_amount')}}</p>
        <div class="cont-item quantity">
          <div class="row">
            <label>{{tradeParams.title3}}<!--我要出售多少||我要购买多少-->
              ({{formData.symbol}}) </label>
            <div class="value">
              <numberbox :class="{error: errors.has('symbol_count')}" v-model="formData.symbol_count" :size="15"
                         :accuracy="4" v-validate="'required|intOrDecimal|buyAmountLimitValid|maxInputValue:9999999999'"
                         data-vv-name="symbol_count"/>
            </div>
            <p class="small"></p>
          </div>
          <div class="prompt">{{getErrorMsg('symbol_count')}}<!--请输入币种数量--></div>
        </div>
        <div class="cont-item tradelimit">
          <div class="row">
            <label class="move">{{$t('otc_ad.otc_ad_Trading_restrictions')}}<!--交易限额-->
              ({{formData.symbol}})</label>
            <div class="">
              <div class="value">
                <numberbox id="ads_min_amount" :class="{error: errors.has('min_amount')}" v-model="formData.min_amount"
                           :size="tradeLimitAccuracy.size" :accuracy="tradeLimitAccuracy.accuracy"
                           v-validate="'required|intOrDecimal|minAmountValid|minamount|maxInputValue:9999999999,public0.public258'"
                           data-vv-name="min_amount"/>
                <em>{{$t('public0.public114')}}<!--最小限额--></em>
              </div>
              <div class="prompt">{{getErrorMsg('min_amount')}}</div>
              <div class="value">
                <numberbox id="ads_max_amount" :class="{error: errors.has('max_amount')}" v-model="formData.max_amount"
                           :size="tradeLimitAccuracy.size" :accuracy="tradeLimitAccuracy.accuracy"
                           v-validate="'required|intOrDecimal|maxamount|maxInputValue:9999999999,public0.public259'"
                           data-vv-name="max_amount"/>
                <em>{{$t('public0.public115')}}<!--最大限额--></em>
              </div>
              <div class="prompt">{{getErrorMsg('max_amount')}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="box">
        <p class="title_p">{{$t('gcox_otc.pay_info')}}</p>
        <div class="cont-item">
          <div class="row">
            <label>{{$t('gcox_otc.pay_way')}}</label>
            <p class="value flex">
              <b>{{$t('gcox_otc.bank_transfer')}}</b>
              <router-link :to="{name: 'control_pay'}">{{$t('gcox_otc.add')}}</router-link>
            </p>
          </div>
        </div>
        <div class="column cont-item">
          <label>{{$t('gcox_otc.bank_name')}}</label>
          <div class="value">
            <p>{{bankData.card_bank}}</p>
          </div>
        </div>
        <div class="column cont-item">
          <label>{{$t('gcox_otc.bank_card_id')}}</label>
          <div class="value">
            <p>{{bankData.card_number}}</p>
          </div>
        </div>
        <div class="column cont-item">
          <label>{{$t('gcox_otc.bank_user')}}</label>
          <div class="value">
            <p>{{bankData.card_name}}</p>
          </div>
          <div class="prompt"></div>
        </div>
      </div>
      <div class="box">
        <p class="title_p">{{$t('gcox_otc.others')}} <!--其他要求--></p>
        <div class="cont-item dispose">
          <div class="row">
            <label class="label-tips">
              <span>{{$t('otc_ad.otc_ad_maximum_orders')}}<!--最大处理订单数--></span>
              <!--<div class="tips">-->
              <!--<span class="tips-container">-->
              <!--<i class="tips-icon" v-tip.top="tip2">?</i>-->
              <!--&lt;!&ndash;单个广告可同时存在的未完成订单最大数量&ndash;&gt;-->
              <!--&lt;!&ndash;-->
              <!--<em class="tips-text">{{$t('otc_ad.otc_ad_max_uncompleted_orders')}}</em>-->
              <!--&ndash;&gt;-->
              <!--</span>-->
              <!--</div>-->
            </label>
            <div class="value">
              <numberbox :class="{error: errors.has('max_process_num')}" v-model="formData.max_process_num"
                         :size="maxOrderProcessing.toString().length"
                         v-validate="`required|pInteger|otcProcessNumValid:${1},${maxOrderProcessing}`"
                         data-vv-name="max_process_num"/>
            </div>
          </div>
          <div class="prompt">{{getErrorMsg('max_process_num')}}</div>
        </div>
        <div class="cont-item good">
          <div class="row">
            <label class="label-tips">
              <span>{{$t('otc_exchange.otc_exchange_Good_rating')}}<!--好评率--></span>
              <!--<div class="tips">-->
              <!--<span class="tips-container">-->
              <!--<i class="tips-icon" v-tip.top="tip3">?</i>-->
              <!--&lt;!&ndash;要求对手方好评率必须大于此设定值&ndash;&gt;-->
              <!--&lt;!&ndash;-->
              <!--<em class="tips-text">{{$t('otc_exchange.otc_exchange_good_rating')}}</em>-->
              <!--&ndash;&gt;-->
              <!--</span>-->
              <!--</div>-->
            </label>
            <div class="value">
              <numberbox :class="{error: errors.has('praise_rate')}" v-model="formData.praise_rate" :size="4"
                         :accuracy="1" v-validate="'required|ratingValid'" data-vv-name="praise_rate"/>
              <em>%</em>
            </div>
          </div>
          <div class="prompt">{{getErrorMsg('praise_rate')}}</div>
        </div>
        <div class="cont-item timelimit">
          <div class="row">
            <label>{{$t('otc_ad.otc_ad_expiration_pay')}}<!--付款期限--></label>
            <div class="value">
              <select v-model="formData.pay_limit_time" v-validate="'required'" data-vv-name="pay_limit_time">
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
              <em>{{$t('otc_ad.otc_ad_minute')}}<!--分钟--></em>
            </div>
          </div>
          <div class="prompt">{{getErrorMsg('pay_limit_time')}}<!--请输入付款期限--></div>
        </div>
      </div>
      <!--<div class="cont-item tradetype">-->
      <!--<div class="row">-->
      <!--<label>{{$t('otc_exchange.otc_exchange_transaction_method')}}：&lt;!&ndash;交易方式&ndash;&gt;<em-->
      <!--class="asterisk">&nbsp;*</em></label>-->
      <!--<div class="value">-->
      <!--<input :class="{error: errors.has('pay_type')}" type="hidden" v-validate="'required'" data-vv-name="pay_type"-->
      <!--v-model="formData.pay_type"/>-->
      <!--<span v-for="item in payments" :key="item.id" @click="setPayment(item)"-->
      <!--v-if="myPayType.indexOf(item.id) !== -1">-->
      <!--<i :class="[item.checked ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked']"></i>{{$t(item.key)}}-->
      <!--</span>-->
      <!--</div>-->
      <!--</div>-->

      <!--<div class="prompt">{{getErrorMsg('pay_type')}}</div>-->
      <!--</div>-->

      <div class="cont-item button">
        <!--<button class="cancel" @click="closeDalg">{{$t('otc_legal.otc_legal_cancel')}}&lt;!&ndash;取消&ndash;&gt;</button>-->
        <button class="yellow_button" :class="{disabled:locked}" @click="saveAds">{{$t('otc_ad.otc_ad_confirm')}}
          <!--确认--></button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import {Validator} from 'vee-validate'
  import otcApi from '@/api/otc'
  import otcConfig from '@/assets/js/otcconfig'
  import numUtils from '@/assets/js/numberUtils'
  import utils from '@/assets/js/utils'
  import numberbox from '@/components/formel/numberInput'
  import adconfirm from '@/otc/otchome/adconfirm'

  let additional = []
  otcConfig.additional.forEach(function (item) {
    additional.push(item.symbol)
  })
  export default {
    props: ['params', 'ad_id', 'myPayType'],
    components: {
      numberbox
    },
    data () {
      return {
        coinMinLimit: 0,
        currencyMinLimit: 0,
        maxOrderProcessing: 0,
        locked: false,
        payments: JSON.parse(JSON.stringify(otcConfig.payments)),
        isClickPayments: false,
        formData: {
          ad_type: Number(this.params.ad_type) === 2 ? 1 : 2,
          symbol: this.params.symbol || otcConfig.symbol,
          currency: this.params.currency,
          bench_marking_id: null,
          price_rate: null,
          price_type: 1,
          lowest_price: null,
          symbol_count: null,
          min_amount: null,
          max_amount: Number(this.params.ad_type) === 2 ? null : 20000,
          pay_type: null,
          max_process_num: 2,
          praise_rate: 50,
          pay_limit_time: 15
        },
        currencyList: [],
        benchItem: {
          price: null,
          lowestPrice: null
        },
        benchDatas: [], // 对标交易所
        isATN: false,
        bankData: {}
      }
    },
    computed: {
      ...mapGetters(['getLang','getCurrency']),
      tip1 () {
        return {
          container: document.body,
          zIndex: 9999999,
          content: this.$t('otc_exchange.otc_exchange_price_float_rate')
        }
      },
      tip2 () {
        return {
          container: document.body,
          zIndex: 9999999,
          content: this.$t('otc_ad.otc_ad_max_uncompleted_orders')
        }
      },
      tip3 () {
        return {
          container: document.body,
          zIndex: 9999999,
          content: this.$t('otc_exchange.otc_exchange_good_rating')
        }
      },
      msgs () {
        return {
          lowest_price: {required: this.$t('public0.public113')}, // 请输入单价
          min_amount: {required: this.$t('otc_ad.otc_ad_minimum_amount')}, // 请输入最小限额
          max_amount: {required: this.$t('otc_ad.otc_ad_maximum_amount')}, // 请输入最大限额
          pay_limit_time: {required: this.$t('otc_ad.otc_ad_payment_period')}, // 请输入付款期限
          symbol_count: {required: this.$t('public0.public112')}, // 请输入币种数量
          praise_rate: {required: this.$t('public0.public186')}, // 请输入好评率
          pay_type: {required: this.$t('public0.public118')}, // 请选择交易方式
          max_process_num: {required: this.$t('public0.public163').format(1, this.maxOrderProcessing)} // 请输入整数{0}~{1}
        }
      },
      benchSymbolParams () {
        return {
          ad_type: this.formData.ad_type,
          symbol: this.formData.symbol,
          currency: this.formData.currency,
          bench_marking_id: this.formData.bench_marking_id
        }
      },
      tradeParams () {
        if (this.formData.ad_type === 2) {
          return {
            title1: this.$t('otc_exchange.otc_exchange_sell'), // 出售
            title2: this.$t('public0.public137'), // 可接受的最低单价
            title3: this.$t('gcox_otc.sell_number') // 出售数量
          }
        } else if (this.formData.ad_type === 1) {
          return {
            title1: this.$t('otc_exchange.otc_exchange_buy'), // 购买
            title2: this.$t('public0.public136'), // 可接受的最高单价
            title3: this.$t('gcox_otc.buy_number') // 购买数量
          }
        }
      },
      curPrice () {
        if (this.benchItem.lowestPrice && this.formData.price_rate) {
          return numUtils.mul(this.benchItem.lowestPrice, numUtils.div(100 + this.formData.price_rate * 1, 100)).toFixed(2)
        } else {
          return this.benchItem.lowestPrice
        }
      },
      tradeLimitAccuracy () {
        return this.formData.ad_type === 1 ? {size: 15, accuracy: 4} : {size: 13, accuracy: 2}
      }
    },
    watch: {
      'formData.pay_type' () {
        if (this.isClickPayments) {
          this.isClickPayments = false
        } else {
          this.payments.forEach((item) => {
            if (this.formData.pay_type.indexOf(item.id) !== -1) {
              item.checked = true
            } else {
              item.checked = false
            }
          })
        }
      },
      'formData.symbol_count' (newVal) {
        if (this.formData.ad_type === 1) {
          this.formData.max_amount = newVal
        }
      },
      benchSymbolParams () {
        this.getBenchSymbolInfo()
      }
    },
    created () {
      console.log(this.params)
      this.getBank()
      this.isATN = additional.includes(this.params.symbol)
      Validator.extend('minAmountValid', {
        getMessage: (field, args) => {
          if (this.formData.ad_type === 1) {
            return this.$t('public0.public110').format(this.coinMinLimit) // 最小限额必须大于等于{0}
          } else {
            return this.$t('public0.public110').format(this.currencyMinLimit) // 最小限额必须大于等于{0}
          }
        },
        validate: (value, args) => {
          value = parseFloat(value)
          if (this.formData.ad_type === 1) {
            return value >= this.coinMinLimit
          } else {
            return value >= this.currencyMinLimit
          }
        }
      })
      Validator.extend('buyAmountLimitValid', {
        getMessage: (field, args) => {
          return this.$t('public0.public119').format(this.coinMinLimit) // 购买数量必须大于等于{0}
        },
        validate: (value, args) => {
          value = parseFloat(value)
          if (this.formData.ad_type === 1) {
            return value >= this.coinMinLimit
          } else {
            return true
          }
        }
      })
      this.$nextTick(() => {
        this.fnGetBenchExchange()
        this.fnGetAdvertisementDetail()
        this.fnGetBaseInfo()
      })
    },
    methods: {
      getBank () {
        otcApi.getPaySettings((res) => {
          // 银行卡
          this.bankData = {
            card_name: res.data.card_name,
            card_bank: res.data.card_bank,
            card_number: res.data.card_number
          }
        })
      },
      fnGetBenchExchange () { // 获取对标交易所
        otcApi.getBenchExchange((res) => {
          this.benchDatas = res
          if (res.length) {
            this.formData.bench_marking_id = res[0].bench_marking_id
          }
        })
      },
      getBenchSymbolInfo () { // 获取对标交易所币种价格
        otcApi.getBenchSymbolInfo(this.benchSymbolParams, (res) => {
          this.benchItem.price = numUtils.BN(res.cur_price || 0).toFixed(2)
          this.benchItem.lowestPrice = numUtils.BN(res.market_price || 0).toFixed(2)
          if (this.isATN) {
            this.formData.lowest_price = this.benchItem.lowestPrice
          }
        })
      },
      fnGetAdvertisementDetail () { // 修改广告 - 获取广告详情
        if (this.ad_id) {
          otcApi.getAdvertisementDetail(this.ad_id, (res) => {
            // 数据格式化
            for (var i in this.formData) {
              if (i === 'price_rate' && utils.removeEndZero(res[i] || '0') === '0') {
                continue
              } else if (i === 'lowest_price' && numUtils.BN(0).equals(res[i])) {
                res[i] = null
              } else if (i === 'min_amount' || i === 'max_amount' || i === 'lowest_price') {
                res[i] = utils.removeEndZero(res[i])
              } else if (i === 'pay_type') {
                let tempArray = []
                res[i].split(',').forEach((item) => {
                  if (this.myPayType.indexOf(item) !== -1) {
                    tempArray.push(item)
                  }
                })
                res[i] = tempArray.join(',')
              }
              this.formData[i] = res[i]
            }
            //console.log(this.formData)
            this.formData.ad_type = res.ad_type
            this.formData.bench_marking_id = parseInt(res.bench_marking_id)
            this.formData.symbol_count = utils.removeEndZero(numUtils.BN(res.symbol_count).toFixed(5))
            this.formData.min_amount = utils.removeEndZero(numUtils.BN(res.min_amount).toFixed(parseInt(res.ad_type) === 1 ? 5 : 2))
            this.formData.max_amount = utils.removeEndZero(numUtils.BN(res.max_amount).toFixed(parseInt(res.ad_type) === 1 ? 5 : 2))
            this.formData.price_type = 1
            // 获取Symbol或Currency的最小交易限额
            this.fnGetSymbolAndCurrency(false, res.ad_type)
          }, (msg) => {
            console.error(msg)
          })
        } else {
          this.formData.pay_type = this.myPayType
          // 获取Symbol或Currency的最小交易限额
          this.fnGetSymbolAndCurrency(true, this.formData.ad_type)
        }
      },
      fnGetSymbolAndCurrency (isNew, adType) {
        otcApi.getCoinsList((data) => { // 获取币种信息
          data.forEach((item) => {
            if (item.symbol === this.formData.symbol) {
              this.coinMinLimit = item.minLimit
              if (isNew) {
                this.formData.min_amount = item.minLimit
              }
            }
          })
          otcApi.getCurrencys((data2) => { // 获取法币信息
            data2.forEach((item2) => {
              if (item2.currency === this.formData.currency) {
                this.currencyMinLimit = item2.minLimit
                if (isNew && adType === 2) {
                  this.formData.min_amount = item2.minLimit
                }
              }
            })
            this.currencyList = data2
          }, (msg2) => {
            console.error(msg2)
          })
        }, (msg) => {
          console.error(msg)
        })
      },
      fnGetBaseInfo () { // 获取最大处理订单数
        otcApi.getBaseInfo(this.formData.symbol, (data) => {
          this.maxOrderProcessing = data.adMaxConcurrency
        }, (msg) => {
          console.error(msg)
        })
      },
      setPayment (item) {
        this.isClickPayments = true
        item.checked = !item.checked
        var arr = []
        this.payments.forEach((item) => {
          item.checked && arr.push(item.id)
        })
        this.formData.pay_type = arr.join(',')
      },
      getErrorMsg (name) {
        return this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
      },
      closeDalg () {
        this.$emit('removeDialog')
      },
      saveAds () {
        this.$validator.validateAll(this.formData).then((validResult) => {
          if (!validResult) {
            return
          }
          var formData = JSON.parse(JSON.stringify(this.formData))
          formData.lowestPrice = this.benchItem.lowestPrice
          formData.isATN = this.isATN
          Vue.$confirmDialog({
            id: 'ads_create_or_edit_confirm',
            title: this.$t(this.ad_id ? 'public0.public253' : 'public0.public254'), // 修改广告确认；发布广告确认
            isComponent: true,
            content: adconfirm,
            btnPosition: 'right',
            width: 620,
            item: formData,
            okCallback: () => {
              if (this.locked) {
                return
              }
              this.locked = true
              if (this.ad_id) {
                this.updateAds()
              } else {
                this.createAds()
              }
            }
          })
        })
      },
      createAds () {
        var formData = JSON.parse(JSON.stringify(this.formData))
        otcApi.createAdvertisement(formData, (msg) => {
          this.locked = false
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          this.params.newAdCount++
          this.$router.push({name: 'home'})
        }, (msg) => {
          this.locked = false
          let errMsg = typeof msg === 'string' ? msg : msg[0]
          let errArr = errMsg.split(' ')
          errMsg = errArr.length === 1 ? this.$t(`error_code.${errArr[0]}`) : this.$t(`error_code.${errArr[0]}`) + this.$t('public0.public260') + this.$t(`error_code.${errArr[1]}`)
          if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_SUM_TIP') {
            errMsg += '\u0020' + this.formData.currency
          } else if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_COUNT_TIP') {
            errMsg += '\u0020' + this.formData.symbol
          }
          Vue.$confirmDialog({showCancel: false, content: errMsg})
        })
      },
      updateAds () {
        var formData = JSON.parse(JSON.stringify(this.formData))
        otcApi.updateAdvertisement(this.ad_id, formData, (msg) => {
          this.locked = false
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          this.params.newAdCount++
          this.$emit('removeDialog')
        }, (msg) => {
          this.locked = false
          let errMsg = typeof msg === 'string' ? msg : msg[0]
          let errArr = errMsg.split(' ')
          errMsg = errArr.length === 1 ? this.$t(`error_code.${errArr[0]}`) : this.$t(`error_code.${errArr[0]}`) + this.$t('public0.public260') + this.$t(`error_code.${errArr[1]}`)
          if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_SUM_TIP') {
            errMsg += '\u0020' + this.formData.currency
          } else if (errArr.length === 2 && errArr[0] === 'MIN_TRADE_COUNT_TIP') {
            errMsg += '\u0020' + this.formData.symbol
          }
          Vue.$confirmDialog({showCancel: false, content: errMsg})
        })
      },
      maket (id) {
        this.benchDatas.filter(res => {
          if (res.bench_marking_id === id) {
            return res.marking_name
          }
        })
      }
    }
  }
</script>

<style scoped>
  .createorder {
    width: 100%;
    margin: 50px auto;
  }

  .createorder.englishsize {
    width: 360px;
  }

  .createorder .title {
    padding: 15px 0;
    color: #fff;
    font-size: 18px;
    text-align: center;
    background: rgba(19, 20, 58, 1);
  }

  .createorder .cont {
    padding: 40px;
    border: 1px solid #eeeeee;
  }

  .cont-item .row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .cont-item {
    margin: 0 auto;
  }

  .cont-item label {
    display: block;
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    color: #333;
    width: 190px;
  }

  .cont-item label em.asterisk {
    position: relative;
    top: 6px;
    line-height: 0;
    font-size: 18px;
    color: red;
  }

  .cont-item label.label-tips {
    font-size: 0;
  }

  .cont-item label.label-tips > span {
    font-size: 16px;
  }

  .cont-item label.label-tips .tips {
    display: inline-block;
    margin-top: 6px;
    margin-left: 6px;
    vertical-align: top;
  }

  .cont-item label.label-tips .tips-container {
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 1;
    width: 14px;
    height: 14px;
  }

  .cont-item label.label-tips .tips-icon {
    width: 14px;
    height: 14px;
    font-weight: bold;
    font-size: 16px;
    line-height: 14px;
    color: #fff;
    text-align: center;
    background-color: #ccc;
    border-radius: 50%;
    cursor: help;
  }


  .cont-item .value {
    position: relative;
    font-weight: 600;
    width: 280px;
  }

  .cont-item.tradetype .value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
  }

  .cont-item .value select {
    height: 50px;
    padding-left: 12px;
    padding-right: 16px;
    font-size: 16px;
    color: #666666;
    background-position: right 4px center;
    border: 1px solid #ccc;
    cursor: pointer;
    font-weight: 600;
  }

  .currency{
    border-bottom: 1px solid #eeeeee;
  }
  .currency label {
    padding-right: 15px;
  }

  .exchange {
    border-bottom: 1px solid #eeeeee;
  }

  .cont-item.exchange .value select {
    width: 100%;
  }

  .cont-item.timelimit .value select {
    position: relative;
    z-index: 1;
    width: 100%;
  }

  .cont-item .value span {
    font-size: 16px;
    color: #999;
    flex: 1;
    text-align: right;
  }

  .cont-item.tradetype .value span {
    cursor: pointer;
  }

  .cont-item.tradetype .value span i {
    padding-right: 4px;
    color: #00a0e9;
  }

  .cont-item.tradetype .value span i:hover {
    color: #2565c5;
  }

  .cont-item .value input {
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding-left: 12px;
    padding-right: 12px;
    font: 12px/normal 'Microsoft YaHei';
    color: #333;
    background-color: transparent;
    border: 1px solid #ccc;
    font-weight: 600;
  }

  .cont-item .value input.error {
    border-color: #e53f3f;
  }

  .cont-item.premium .value input,
  .cont-item.dispose .value input,
  .cont-item.timelimit .value input,
  .cont-item.good .value input {
    width: 100%;
  }

  .cont-item.acceptable .value input,
  .cont-item.quantity .value input {
    width: 100%;
  }

  .cont-item .value em {
    position: absolute;
    top: 10px;
    right: 13px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #999;
  }

  .cont-item.timelimit .value em {
    right: 21px;
    height: 24px;
    line-height: 32px;
  }

  .cont-item .prompt {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    color: #e53f3f;
    white-space: nowrap;
  }

  .cont-item.button {
    line-height: 0;
    font-size: 0;
    margin-top: 60px;
    text-align: center;
  }

  .cont-item.button button {
    width: 130px;
    height: 60px;
    background: rgba(240, 185, 54, 1);
    color: #ffffff;
    font-size: 16px;
    border-radius: 4px 3px 3px 3px;
    cursor: pointer;
  }

  .cont-item.button button.cancel {
    margin-right: 10px;
    color: #333;
    background-color: transparent;
    border: 1px solid #ccc;
  }

  .cont-item.button button.cancel:hover {
    color: #111;
    border-color: #bbb;
  }

  .cont-item.button button.comfirm {
    color: #fff;
    background-color: #00a0e9;
  }

  .cont-item.button button.comfirm:hover {
    background-color: #2565c5;
  }

  .cont-item.button button.comfirm.disabled {
    background-color: #999;
    cursor: not-allowed;
  }

  .cont-item.button button.comfirm.disabled:hover {
    background-color: #999;
  }

  .move {
    position: relative;
    top: -48px;
    /*left: 230px;*/
  }

  .cont .column {
    overflow: auto;
  }

  .cont .column label {
    font-size: 16px;
    margin: 10px 0;
  }

  .cont .column .value {
    width: 670px !important;
    height: 50px;
  }

  .box {
  }

  .box .flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .box .flex a {
    color: #F0B936;
    width: 70px;
    text-align: center;
  }

  .box .wn {
    display: inline-block;
    width: 218px;
    font-weight: 600;
  }

  .box .cont-item {
    border-left: 4px solid #eeeeee;
    padding-left: 14px;
  }

  .box .cont-item .value {
    width: 470px;
    height: 50px;
    display: flex;
    align-items: center;
  }

  .box .title_p {
    font-size: 18px;
    margin: 30px 0 22px 0;
  }

  .w250 {
    width: 250px !important;
  }

  .box .value > p {
    height: 20px;
    line-height: 20px;
    padding: 14px 0;
    border-bottom: 1px solid #eeeeee;
    flex: 1;
  }

  .small {
    font-size: 16px;
    color: #aaaaaa;
    margin-left: 60px;
  }

  .small span {
    display: block;
    margin-top: 10px;
    line-height: 24px;
  }
</style>
