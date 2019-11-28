<template>
  <div ref="withdrawBox" class="withdrawBox" @click="showDropdown=false;showSymbol=false">
    <div class="koall-verify-all">
      <div class="koall-verify-title">
        <p>{{$t('account.estimated_value_withdrawal')}}<!--提现--></p>
        <small @click="close()">
          <img src="../../assets/img/close.png">
        </small>
      </div>
      <div class="input-box">
        <div class="filed">
          <em>{{$t('account.estimated_value_available')}}<!--可用余额--></em>
          <p class="c-box">
            <small>{{available}} {{symbol}}</small>
          </p>
        </div>
        <div class="filed">
          <em>
            {{$t('account.user_Pick_up_address').format(symbol)}}<!--提现地址--> *
          </em>
          <div class="withAdress" style="position:relative;" :class="{error:errors.has('selToAddress')}">
            <input type="text" maxlength="100" v-validate="'required'"
                   data-vv-name="selToAddress" v-model="toAddress"/>
            <span class="dowml" @click.stop="showDropdown=!showDropdown"></span>
            <em class="error" v-if="errors.has('selToAddress')">{{this.$t('public0.public44')}}<!--请选择地址或使用新地址--></em>
            <ul v-show="showDropdown">
              <li v-if="datas" class="user-addr" @click.prevent="userSelAddress(datas)">{{datas.memo}} -
                {{datas.address}}
              </li>
              <li v-else>{{$t('usercontent.no-address')}}</li>
            </ul>
          </div>
        </div>
        <div class="filed">
          <div class="filed-number">
            <em>{{$t('account.user_Draw_the_number')}}<!--提现数量--> *</em>

          </div>
          <div class="number" :class="{error:errors.has('amount')}">
            <numberbox v-validate="'required|isLessMin|isMoreMax'" :accuracy="8" data-vv-name="amount" class="numberAll"
                       type="text" v-model="amount"/>
            <a href="javascript:;" @click="allWithdraw">Max<!--全部提现--></a>
            <em class="error" v-if="errors.has('amount')">{{getErrors('amount')}}</em>
          </div>

        </div>

        <div class="filed">
          <div class="filed-number">
            <em>{{$t('business.FEE')}}<!--手续费--> </em>

          </div>
          <div class="number" :class="{error:errors.has('amount')}">
            <numberbox :accuracy="8"
                       disabled="false"
                       class="numberAll"
                       type="text" v-model="procedureFee"/>
          </div>
        </div>

        <div class="filed">
          <div class="filed-number">
            <em>{{$t('account.user_Actual_arrival')}}<!--实际到账--> </em>

          </div>
          <div class="number" :class="{error:errors.has('amount')}">
            <numberbox :accuracy="8"
                       disabled="false"
                       class="numberAll"
                       type="text" v-model="lastMount"/>
          </div>
        </div>

        <div class="filed" v-if="symbol==='EOS' || symbol==='XRP'">
          <div class="filed-number">
            <em>MEMO</em>
          </div>
          <div class="number memo" :class="{error:errors.has('memo')}">
            <input type="text" maxlength="1000" v-validate="memoState ? '':'required'"
                   data-vv-name="memo" v-model="memo"/>
            <em class="error" v-show="errors.has('memo')">
              {{$t('error_code.EOS_MEMO_BLANK')}}
            </em>
          </div>
          <label class="rpl">
            <input type="checkbox" v-model="memoState">
            <span>{{$t('gcox_otc.not_need_memo')}}<!--不需要MEMO--></span>
          </label>
        </div>

        <div class="filed" v-if="showSMS">
          <div class="filed-number">
            <em>{{$t('account.user_center_SMS_code')}}<!--短信验证码--> * </em>

          </div>
          <div class="number" :class="{error:errors.has('smsCode')}">
            <numberbox data-vv-name="amount" class="numberAll"
                       type="text" v-model="smsCode"/>
            <a href="javascript:;" @click="senSMS()" class="send_sms">{{disabled ? time+'s':$t('public0.public161')}}
              <!--发送--></a>
            <em class="error">
              <template v-if="errors.firstRule('smsCode')==='required'">{{$t('login_register.verify_code')}}</template>
            </em>
          </div>
        </div>
        <div class="filed" v-if="showGoolge">
          <em>
            {{$t('usercontent.user61')}}<!--谷歌验证码--> *
          </em>
          <div class="withAdress" style="position:relative;" :class="{error:errors.has('googleCode')}">
            <input type="text" maxlength="6" v-validate="'required'"
                   data-vv-name="googleCode" v-model="googleCode"/>
            <em class="error" v-if="errors.has('googleCode')">{{getErrors('googleCode')}}</em>
          </div>

        </div>
        <div class="filed">
          <input type="button" class="BNB-subbtn" :value="$t('account.user_submit')" @click="walletWithdraw"/><!--提交-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import userUtils from '@/api/wallet'
  import userApi from '@/api/individual'
  import numUtils from '@/assets/js/numberUtils'
  import {Validator} from 'vee-validate'
  import numberbox from '@/components/formel/numberbox'
  import utils from '@/assets/js/utils'
  import add from '../account/addSymbol'

  export default {
    components: {
      numberbox
    },
    props: ['item', 'all_data'],
    data () {
      return {
        symbol: null,
        symbolType: null,
        fromAccount: null,
        available: null,
        fromAddress: null,
        procedure: null,
        minWithdraw: null,
        mobileState: null,
        fixedNumber: 8,
        payPassword: null,
        googleCode: null,
        datas: {},
        showDropdown: false,
        showNewAddress: false,
        showSymbol: false,
        memo: '', //提现备注
        alias: '', // 别名
        amount: '', // 提现金额
        toAddress: '', // 提现地址
        showPayPW: false,
        allData: [],
        smsCode: null,
        msgs: {
          amount: {required: this.$t('public0.public46')}, // 请输入提现金额
          payPassword: {required: this.$t('usercontent.inp-pay-pw')}, // 请输入资金密码
          googleCode: {required: this.$t('usercontent.user33')}, // 请输入谷歌认证码
        },
        time: 60,
        disabled: false,
        showSMS: false,
        showGoolge: false,
        memoState: false,
      }
    },
    watch: {
      amount (newVal) {
        if (newVal.length > 18) {
          this.$nextTick(() => {
            this.amount = newVal.substring(0, 18)
          })
        }
      },
      'alias' (newVal) {
        if (newVal.length > 15) {
          this.alias = newVal.substring(0, 15)
        }
      },
      'toAddress' (newVal) {
        if (newVal.length > 100) {
          this.toAddress = newVal.substring(0, 100)
        }
      },
      memoState (e) {
        if (e) {
          this.memo = null
        }
      }
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getSysParams']),
      procedureFee () { // 手续费 提现数量-固定手续费
        return utils.removeEndZero(numUtils.BN(this.procedure).toFixed(8)) + this.symbol
      },
      lastMount () { // 实际到账
        if (this.amount === '' || this.amount === 0) {
          return '0 ' + this.symbol
        } else {
          return utils.removeEndZero(numUtils.minus(this.amount, this.procedureFee).toFixed(8, 1)) + this.symbol
        }
      },
      isLessMin () { // 是否小于最小额度
        return numUtils.BN(this.amount).gte(numUtils.BN(this.minWithdraw))
      },
      isMoreMax () { // 是否大于可用余额
        return numUtils.BN(this.amount).lte(numUtils.BN(this.available))
      }
    },
    created () {
      console.log(this.getSysParams)
      this.showSMS = this.getSysParams.withdrawSmsVerify.value == 2
      this.showGoolge = this.getSysParams.withdrawGoogleAuth.value == 2
      let item = this.item || this.$route.params.item
      this.allData = this.all_data || this.$route.params.allData

      console.log(item, this.allData)
      if (!item || item === 'undefined') {
        //console.log('error')
        this.$router.push({
          name: 'control_wallet',
        })
      } else {
        this.symbol = item.symbol
        this.symbolType = item.symbolType
        this.fromAccount = item.fromAccount
        this.available = item.available
        this.fromAddress = item.fromAddress
        this.procedure = item.procedure
        this.minWithdraw = item.minWithdraw
      }
      //console.log(this.allData)
      this.getUserState()
      Validator.extend('isLessMin', {
        getMessage: (field, args) => this.$t('account.user_minimum_number_of_cash').format(`${this.minWithdraw}`),
        validate: (files, args) => {
          return this.isLessMin
        }
      })
      Validator.extend('isMoreMax', {
        getMessage: (field, args) => this.$t('public0.public47').format(this.available), // 提现额度不能大于可用余额：{0}
        validate: (files, args) => {
          return this.isMoreMax
        }
      })
      this.$nextTick(() => {
        userUtils.listWithdraws( // 获取提现地址列表
          this.symbol, (res) => {
            this.datas = res
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
      })
    },
    methods: {
      getUserState () {
        // 获取当前用户状态信息
        userApi.getUserState((data) => {
          this.mobileState = data.mobileAuthState
        }, (msg) => {
          console.error(msg)
        })
      },
      senSMS () {
        if (this.getUserInfo.mobile) {
          if (this.disabled) {
            return
          }
          this.disabled = true
          userApi.sendAuthSMSCode({
            countryCode: this.getUserInfo.countryCode,
            phoneNumber: this.getUserInfo.mobile
          }, (msg) => {
            let timeOut = () => {
              this.time--
              if (this.time === 0) {
                this.disabled = false
                this.time = 60
                return
              }
              setTimeout(timeOut, 1000)
            }
            timeOut()
            Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          }, (msg) => {
            this.disabled = false
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`gcox_otc.no_bind_mobile`)})
        }
      },
      toFixed (value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
      },
      getErrors (name) {
        return this.msgs[name][this.errors.firstRule(name)] || this.$t(this.errors.first(name)) || null
      },
      closeDailog () {
        this.$emit('removeDialog')
      },
      removeAddress (itemIndex, id) { // 移除提现地址
        userUtils.removeWithdraws({
          id: id
        }, (msg) => {
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          this.datas.splice(itemIndex, 1)
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      userSelAddress (item) { // 现在现有地址
        this.toAddress = item.address
        this.showNewAddress = false
        this.showDropdown = false
      },
      useNewAddress () { // 使用新地址
        // this.toAddress = ''
        // this.showNewAddress = true
        // this.showDropdown = false
        // this.errors.clear()
        utils.setDialog(add, {
          symbol: this.symbol,
          okCallback: (data) => {
            this.toAddress = data.address
          }
        })
      },
      allWithdraw () {
        this.amount = this.available
      },
      walletWithdraw () { // 提现请求
        let validData = {}
        validData = {
          alias: this.alias,
          toAddress: this.toAddress,
          amount: this.amount,
        }
        if (this.showGoolge) {
          if (this.getUserInfo.googleAuthEnable === 0) {
            Vue.$koallTipBox({
              icon: 'notification',
              message: this.$t(`account.user_center_state_unbind`) + this.$t(`auth_warning.warning_google_auth`)
            })
            return
          }
          validData.googleCode = this.googleCode
        }
        if (this.showSMS) {
          validData.smsCode = this.smsCode
        }
        if (!this.memoState && (this.symbol === 'EOS' || this.symbol === 'XRP')) {
          validData.memo = this.memo
        }
        this.$validator.validateAll(validData).then((validResult) => {
          if (!validResult) {
            return
          }
          //
          let formData = { // 提现
            symbol: this.symbol,
            symbolType: this.symbolType,
            fromAccount: this.fromAccount, // 用户id
            memo: this.memo,
            lang: window.localStorage.getItem('lang') === 'zh-CN' ? 'cn' : 'en',
            type: 0
          }
          Object.assign(formData, validData)
          console.log(formData)
          userUtils.walletWithdraw(formData, (res) => {
            Vue.$koallTipBox({icon: 'success', message: res})
            this.$emit('okCallback')
            this.$emit('removeDialog')
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        })
      },
      changeW (item) {
        //  换提现币种
        this.symbol = item.symbol
        this.symbolType = item.symbolType
        this.fromAccount = item.accountId
        this.available = item.availableBalance
        this.fromAddress = item.getAddress
        this.procedure = item.procedureFee
        this.minWithdraw = item.minWithdraw
        this.showSymbol = false
      },
      close () {
        this.$emit('removeDialog')
      }
    }
  }
</script>
<style scoped lang="less">
  div.error, input.error {
    border-color: #e53f3f !important;
  }

  em.error {
    position: absolute;
    left: 0px;
    bottom: -16px;
    color: #e53f3f !important;
    height: 18px !important;
    line-height: 18px;
    font-size: 12px !important;
  }

  .withdrawBox {
    padding: 0;
    background-color: #fff;
    color: #333;
    overflow: hidden;
    position: relative;
    width: 900px;
    border-radius: 8px;
  }

  .tbsm {
    background-color: #242328;
    margin-top: 25px;
    padding: 10px;
    line-height: 30px;
    display: flex;
  }

  .withdrawBox .filed {
    margin-bottom: 30px;
    position: relative;
  }

  .withdrawBox .filed .joint {
    color: #283149;
  }

  .withdrawBox .filed em {
    font-size: 16px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    color: #999;
    text-align: right;
    padding-right: 10px;
  }

  .withdrawBox .filed em i.asterisk {
    position: relative;
    top: 5px;
    line-height: 0;
    font-size: 18px;
    color: red;
  }

  .withdrawBox .filed label {
    /*display: inline-block;*/
    /*font-size: 12px;*/
    /*color: #999;*/
    /*width: 150px;*/
    height: 30px;
    line-height: 30px;
    /*text-align: right;*/
    position: absolute;
    /*left: -25px;*/
    /*top: 0;*/
  }

  .withdrawBox .filed .withdraw-info {
    display: inline-block;
    box-sizing: border-box;
    padding: 0px;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: transparent;
    font-size: 14px;
    color: #0b0c0e;
  }

  .withdrawBox .filed .withdraw-info > div {
    font-size: 16px;
    color: #979799;
    margin-bottom: 30px;

    span {
      display: block;
      border-bottom: 1px solid hsla(0, 0%, 100%, .12);
      font-size: 14px;
      color: #f1f1f2;

    }
  }

  .withdrawBox .filed .BNB-subbtn {
    width: 130px;
    height: 50px;
    background: rgba(240, 185, 54, 1);
    border-radius: 3px;
    color: #ffffff;
    margin: 5px auto;
    display: block;
  }

  .withdrawBox .filed .BNB-subbtn:hover {
    border: 1px solid #4d4a64;
    background-color: #4d4a64;
  }

  .withdrawBox .filed .withAdress {
    position: relative;
    border-bottom: 1px solid hsla(0, 0%, 100%, .12);

    .pwd-isShow {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 9;

      img {
        width: 20px;
      }
    }
  }

  .withdrawBox .filed.memo {
    padding-top: 10px;
    margin-bottom: 5px;
  }

  .withdrawBox .filed.memo em {
    width: 50px;
    display: block;
    height: 28px;
    line-height: 28px;
  }

  .withdrawBox .filed.memo input {
    flex: 1;
    height: 28px;
    width: 100%;
    border-bottom: 1px solid hsla(0, 0%, 100%, .12);
  }

  .withAdress span.dowml {
    position: relative;
    cursor: pointer;
    vertical-align: top;
    width: 29px;
    height: 30px;
    border-left: 1px solid transparent;
    display: inline-block;
    float: right;
  }

  .withAdress span.dowml:before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border: 1px solid #999;
    border-top-color: transparent;
    border-right-color: transparent;
    position: absolute;
    transform: rotate(-45deg);
    top: 10px;
    left: 5px;
  }

  .withAdress span.dowml:hover:before {
    border-color: #00B5FF;
    border-top-color: transparent;
    border-right-color: transparent;
  }

  .withAdress input {
    width: 529px;
    background-color: transparent;
    height: 20px;
    padding: 15px;
    font-size: 18px;
  }

  .withAdress ul {
    position: absolute;
    z-index: 22;
    width: 470px;
    top: 50px;
    left: 0;
    background: #ffffff;
    padding: 6px 0;
    box-shadow: 0 0 6px #eeeeee;
  }

  .withAdress ul li {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    text-indent: 12px;
    background-color: #ffffff;
    cursor: pointer;
    padding: 0 6px;

    &.active {
      background-color: #eeeeee;
      color: #00B5FF;
    }
  }

  .withAdress ul li:hover {
    background-color: #eeeeee;
    color: #00B5FF;
  }

  .withAdress ul li span {
    font-size: 16px;
    position: absolute;
    right: 7px;
    top: 8px;
    cursor: pointer;
  }

  .withAdress ul li img {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }

  .withdrawBox .fee {
    margin-bottom: -10px;
  }

  .tixian {
    margin-bottom: 5px;
    height: 30px;
  }

  .isAddAddress {
    width: 130px;
    box-sizing: border-box;
    height: 30px;
    padding-left: 12px;
    padding-right: 12px;
    line-height: 28px;
    color: #261003;
    background-color: transparent;
    border: 1px solid #ccc;
  }

  .address {
    width: 357px;
    box-sizing: border-box;
    height: 30px;
    padding-left: 12px;
    padding-right: 12px;
    line-height: 28px;
    color: #261003;
    background-color: transparent;
    border: 1px solid #ccc;
  }

  .number {
    position: relative;
    box-sizing: border-box;
    height: 30px;
    padding: 0 12px;
    border-bottom: 1px solid hsla(0, 0%, 100%, .12);
    margin-top: 0px;
    color: #979799;
    text-align: right;
    line-height: 30px;
  }

  .number a {
    width: 58px;
    height: 50px;
    background: #13143A;
    border-radius: 3px;
    text-align: center;
    color: #ffffff;
    line-height: 50px;
    font-size: 18px;
  }

  .number a.send_sms {
    background: #1BB3F6;
    padding: 0 16px;
    color: #ffffff !important;
  }

  .number a:hover {
    color: #00B5FF;
  }

  .number .numberAll {
    /*position: absolute;*/
    /*left: 0;*/
    /*width: 408px;*/
    /*height: 28px;*/
    /*line-height: 28px;*/
    /*color: #ffffff;*/
    /*background-color: transparent;*/
    height: 20px;
    flex: 1;
    padding: 15px;
    font-size: 18px;
    background: transparent;
  }

  .number span {
    position: absolute;
    right: 0;
    top: 30px;
  }

  .withdrawBox:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
  }

  .withdrawBox .tips {
    width: 226px;
    margin-top: 18px;
  }

  .withdrawBox .tips li {
    line-height: 1.5;
    list-style-type: square;
    font-size: 14px;
    color: #666;
    padding: 5px 0;
    border: none;
    width: 190px;
  }

  .withdrawBox .tips li a {
    color: #aeb7d0;
    text-decoration: underline;
    font-size: 14px;
  }

  /* .koall-verify-title{width: 100%;height: 16px;line-height: 16px;margin-top: 2px;} */
  .koall-verify-title {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    line-height: 30px;
    padding: 10px 20px;
    border-bottom: 1px solid #eeeeee;
  }

  .koall-verify-title p {
    font-size: 18px;
  }

  .koall-verify-title img {
    width: 16px;
  }

  .koall-verify-title a {
    font-size: 14px;
    color: #fff;
  }

  .koall-verify-title span:hover {

  }

  .koall-verify-all {
    display: block;
    width: 100%;
  }

  .withdrawBox .filed > em:not(.error) {
    width: 210px;
  }

  .filed {
    .filed-number {
      width: 210px;
      display: inline-block;
      text-align: right;
      padding-right: 10px;
    }

    .number, .withAdress, .c-box {
      width: 470px;
      height: 50px;
      padding: 0;
      background: #eeeeee;
      border-radius: 3px;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;

      small {
        height: 20px;
        padding: 15px;
        font-size: 18px;
      }
    }
  }

  .filed-number {
    display: flex;
    justify-content: space-between;
  }

  .filed-number span {
    line-height: 30px;
    color: #999;
  }

  input::-webkit-input-placeholder { /* WebKit browsers */
    color: #818fae;
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #818fae;
  }

  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #818fae;
  }

  input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #818fae;
  }

  .input-box {
    padding-top: 30px;
    width: 760px;
    margin: 0 auto;
  }

  .green {
    color: #1bc863
  }

  .add-address {
    position: absolute;
    right: -100px;
    top: 41px;
    width: 100px;
    color: #999;
    height: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .symbol {
    font-size: 16px;

    p {
      font-size: 14px;
      color: #fff;
      position: relative;
      width: 100%;
      height: 30px;

      &:before {
        content: "";
        display: inline-block;
        width: 8px;
        height: 8px;
        border: 1px solid #999;
        border-top-color: transparent;
        border-right-color: transparent;
        position: absolute;
        -webkit-transform: rotate(-45deg);
        transform: rotate(-45deg);
        top: 10px;
        right: 16px;
      }

      &:hover:before {
        border-color: #00B5FF;
        border-top-color: transparent;
        border-right-color: transparent;
      }
    }
  }

  .rpl {
    position: absolute;
    right: -104px;
    top: 11px;
    width: 120px;
    display: flex;
    align-items: center;

    span {
      font-size: 12px;
    }
  }

  .memo {
    input {
      width: 100%;
      height: 100%;
      background: transparent;
      text-indent: 10px;
      font-size: 18px;
    }
  }
</style>
