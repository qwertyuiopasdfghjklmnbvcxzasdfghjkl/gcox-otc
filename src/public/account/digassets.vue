<template>
  <div class="digassets">
    <div class="hcontainer">
      <div class="chargeWithdraw" v-if="!showLoaing">
        <div class="total">
          <h2>{{$t('gcox_otc.appraisement')}}：<!--估计资产价值：--><span>{{BTC.toFixed(8).toMoney()}} BTC</span>
          </h2>
          <h4>≈ {{USDCNY.toFixed(4).toMoney()}} {{getCurrency}} </h4>
        </div>
        <div v-if="!showHistory">
          <div class="balance_search">
            <div class="f-fr">
              <div class="icon-checkbox f-fl" @click.stop="hideZero=!hideZero">
                <!--<em :class="[hideZero?'icon-checkbox-unchecked':'icon-checkbox-checked']"></em>-->
                <!--<label class="ng-binding">-->
                <!--{{$t('gcox_otc.show_all_symbol')}}&lt;!&ndash;显示所有货币&ndash;&gt;-->
                <!--</label>-->
              </div>
              <a href="javascript:;" class="f-c-main" @click="showHistory = true">{{$t('account.userViewTheHistory')}}
                <!--历史记录--></a>
            </div>
          </div>
          <div class="tab_cont">
            <div class="thead">
              <p style="width:155px;">{{$t('account.estimated_value_coin')}}</p>
              <p>{{$t('gcox_otc.total')}}</p>
              <p>{{$t('account.estimated_value_available')}}</p>
              <p>{{$t('public0.public34')}}</p>
              <p>{{$t('wallet.currency_valuation')}}</p>
            </div>

            <div class="flex">
              <ul class="accountInfo-lists">
                <li v-for="(data, index) in filterDatas()" :key="data.accountId">
                  <div class="items">
                    <div class="ico">
                      <img :src="`data:image/png;base64,${data.iconBase64}`">
                    </div>
                    <div class="coin">{{data.symbol}}</div>
                    <div class="f-right " :title="toFixed(data.totalBalance)|removeEndZero">
                      {{toFixed(data.totalBalance)|removeEndZero}}
                    </div>
                    <div class="f-right "
                         :title="data.availableBalance">{{data.availableBalance}}
                    </div>
                    <div class="f-right "
                         :title="data.frozenBalance">{{data.frozenBalance |removeEndZero}}
                    </div>
                    <div class="f-right" style="width:230px"
                         :title="(data.currencyValuation || 0) + getCurrency">{{toFixed(data.currencyValuation, 4) || 0
                      }} {{getCurrency}}
                    </div>
                    <moreinfo class="action"
                              :googleState="getUserInfo.googleAuthEnable"
                              :verifyState="getUserInfo.kycState"
                              :symbol="data.symbol"
                              :allData="filterDatas()"
                              :item="data"/>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else>
          <historyrecord>
            <span class="back" @click="showHistory = false">{{$t('usercontent.user64')}}</span>
          </historyrecord>
        </div>
      </div>

      <loading v-if="showLoaing"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import numUtils from '@/assets/js/numberUtils'
  import userUtils from '@/api/wallet'
  import utils from '@/assets/js/utils'
  import userApi from '@/api/individual'
  import moreinfo from '@/public/account/moreinfo'
  import stakeDialog from '@/public/account/stakeDialog'
  import loading from '@/components/loading'
  import ProgressBar from './progress-bar'
  import Historyrecord from './historyrecord'
  import marketApi from '@/api/market'

  export default {
    props: ['pandect'],
    data () {
      return {
        numUtils: numUtils,
        sortActive: null,
        sort: null,
        showLoaing: true,
        hideZero: false,
        filterTitle: '',
        googleState: 0,
        verifyState: 0,
        mobileState: 0,
        myAssets: [],
        active: 'main',
        accountType: 1,
        pandectShow: true,
        echart: null,
        polar: {},
        showHistory: false
      }
    },
    components: {
      Historyrecord,
      ProgressBar,
      moreinfo,
      loading
    },
    computed: {
      ...mapGetters(['getBTCValuation', 'getUSDCNY', 'getCoinSign', 'getCurrency']),
      USDCNY () {
        let num = 0
        this.filterDatas().filter(res => {
          num += res.currencyValuation
        })
        return num
      },
      BTC () {
        if (this.USDCNY) {
          return numUtils.div(Number(this.USDCNY), Number(this.getUSDCNY))
        } else {
          return 0
        }
      }
    },
    watch: {
      BTC (e) {
        this.getBtcPrice(e)
      },
      filterTitle (newVal, oldVal) {
        if (!newVal) {
          return
        }
        if (/[^0-9a-z]/i.test(newVal)) {
          this.$nextTick(() => {
            this.filterTitle = oldVal
          })
        }
      },
      echart (data) {
        let name = []
        let arr = []
        data.filter(res => {
          name.push(res.symbol)
          let obj = {}
          obj.name = res.symbol
          obj.value = res.availableBalance
          arr.push(obj)
        })
      },
      getCurrency () {
        this.getList()
      }
    },
    created () {
      if (this.pandect) {
        this.hideZero = this.pandect.hiddenZore
        this.pandectShow = false
      }
      this.getList()
      // this.getBtcPrice()
    },
    methods: {
      ...mapActions(['getUserInfo', 'getLang', 'setBTCValuation']),
      getBtcPrice (data) {
        this.setBTCValuation(numUtils.BN(data).toFixed(8)) // 当前转换人民币
      },
      showStake (accountName) {
        let data = this.myAssets.filter(item => {
          return item.accountName === accountName && item.type === 1
        })
        if (!data[0].openStaking) {
          return
        }
        utils.setDialog(stakeDialog, {
          data: data[0],
          backClose: true,
          okCallback: () => {
            this.getList()
          }
        })
      },
      filterDatas () {
        let ndatas = this.myAssets.filter((item) => {
          if (this.hideZero) {
            if (this.filterTitle) {
              return (item.caption.toUpperCase().indexOf(this.filterTitle.toUpperCase()) !== -1 ||
                item.symbol.indexOf(this.filterTitle.toUpperCase()) !== -1) &&
                numUtils.BN(item.availableBalance).toString() !== numUtils.BN(0).toString()
            }
            return numUtils.BN(item.availableBalance).toString() !== numUtils.BN(0).toString()
          } else {
            if (this.filterTitle) {
              return item.caption.toUpperCase().indexOf(this.filterTitle.toUpperCase()) !== -1 ||
                item.symbol.indexOf(this.filterTitle.toUpperCase()) !== -1
            }
            return true
          }
        })
        this.echart = ndatas
        return ndatas
      },
      sortAssets (active) {
        if (active === this.sortActive) {
          this.sort = this.sort === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortActive = active
          this.sort = 'asc'
        }
      },
      switchHeadTab (tab) {
        this.active = tab
        if (tab == 'main') {
          this.accountType = 1
        } else {
          this.accountType = 2
        }
      },
      switchTab (tab) {
        this.$emit('switchTab', tab)
      },
      getList () {
        this.showLoaing = true
        userUtils.myAssets({currency: this.getCurrency}, (data) => {
          data.forEach((item) => {
            item.show = false
            item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toFixed(8)
          })
          this.myAssets = data
          this.showLoaing = false
        }, (data, msg) => {
          console.error(msg)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          this.showLoaing = false
        })
      },
      toFixed (value, fixed) {
        return numUtils.BN(value || 0).toFixed(fixed === undefined ? 8 : fixed).toMoney()
      },
      address () {
        if (this.getUserInfo().googleAuthEnable !== 1) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user35')})
          return
        }
        if (this.getUserInfo().kycState !== 1) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user36')})
          return
        }
        this.$router.push('/account/addressManage')
      }
    }
  }
</script>

<style scoped lang="less">
  .icon-checkbox em {
    color: #F0B936;
    cursor: pointer;
  }

  .icon-checkbox:hover em {
    color: #F0B936;
  }

  .icon-checkbox label {
    cursor: pointer;
  }

  .digassets {
    /*background: rgba(27, 26, 31, 0.9);*/
    /*color: #ffffff;*/
    padding: 0 18px 16px;
    font-size: 14px;
    margin: 20px auto;
  }

  .digassets h3 {
    padding: 14px 0;
    font-size: 14px;
    font-weight: 400;
  }

  .total {
    margin-bottom: 30px;
    display: flex;
    align-items: flex-start;
    flex-flow: column;
    background: #13143A;
    padding: 20px;
    position: relative;
    border-radius: 3px;
    color: #ffffff;

    h2 {
      font-size: 24px;
      font-weight: 400;
      margin: 20px 0;
    }

    h4 {
      font-size: 18px;
      font-weight: 400;
    }

    span {
      font-size: 20px;
      margin-left: 10px;
    }

  }

  button {
    cursor: pointer;
    font-size: 12px;
    color: #f1f1f2;
    background-color: #2e2c3c;
    border: 1px solid #312e45;
    text-align: center;
    box-sizing: initial;
    line-height: 28px;
    margin-right: 10px;
    height: 30px;
    padding: 0 10px;
  }

  button:hover {
    border: 1px solid #4d4a64;
    background-color: #4d4a64;
  }

  .balance_search {
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*position: relative;*/
    /*padding-left: 20px;*/
    /*padding-right: 20px;*/
    /*border-bottom: 1px solid #e7e7e7;*/
    font-size: 16px;
    height: 40px;
  }

  .balance_search .total {
    height: 65px;
    line-height: 65px;
    font-size: 16px;
  }

  .balance_search i {
    position: absolute;
    right: 10px;
    top: 8px;
    color: #4a4a4a;
    font-size: 20px;
  }

  .balance_search input {
    line-height: 28px;
    height: 28px;
    width: 100%;
    border: 0;
    background-color: transparent;
    color: #f1f1f2;
    padding-left: 5px;
  }

  .balance_search .checkbox {
    position: relative;
    margin-left: 24px;
    color: #d6dff9;
  }

  .balance_search .checkbox label {
    color: #d6dff9;
    margin-left: 8px;
  }

  .balance_search .checkbox em {
    display: inline-block;
    width: 14px;
    height: 14px;
  }

  .balance_search .checkbox em:before {
    position: absolute;
  }

  .balance_search .f-fr {
    display: flex;
    position: relative;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .balance_search .f-fr p {
    flex-shrink: 1;
    flex-grow: 1;
  }

  .balance_search .f-fr .icon-checkbox {
  }

  .balance_search .f-fr .search_input {
    margin-left: 30px;
    line-height: 30px;
    height: 30px;
    border-bottom: 1px solid #312e45;
    width: 150px;
    position: relative;
  }

  .balance_search .f-fr .total {
    /*color: #333;*/
    font-size: 18px;
    font-weight: bold;
  }

  .balance_search .f-fr .limit {
    height: 32px;
    line-height: 32px;
    margin-left: 20px;
  }

  .balance_search .f-fr .limit span {
    color: #0D66EF;
    cursor: pointer;
  }

  .balance_search .f-fr .limit span:hover {
    color: #0a4fb9;
  }

  .accountInfo-lists {

  }

  .accountInfo-lists button {
    padding-left: 15px;
    padding-right: 15px;
    border-radius: 0;
  }

  .accountInfo-lists button:disabled {
    cursor: not-allowed;
  }

  .accountInfo-lists.header {
    padding-bottom: 0px;
    color: #979799;
  }

  .accountInfo-lists li.th > .items > div {
    align-items: center;
  }

  .accountInfo-lists li.th > .items > div > em {
    position: relative;
    display: inline-block;
    width: 8px;
    height: 26px;
    line-height: 0px;
    flex: initial;
    display: flex;
    margin-left: 2px;
  }

  .accountInfo-lists li.th > .items > div > em i {
    position: absolute;
    top: 0px;
    left: 0px;
    color: #999;
  }

  .accountInfo-lists li.th > .items > div > em i.icon-arrow-down {
    top: inherit;
    bottom: 0px;
  }

  .accountInfo-lists li.th > .items > div > em i.active {
    color: #0D66EF;
  }

  .accountInfo-lists li {
    padding: 0;
  }

  .accountInfo-lists li a {
    color: #eeba42;
  }

  .accountInfo-lists li a:hover a {
    text-decoration: underline;
  }

  .accountInfo-lists li.bg {
    background-color: rgba(232, 179, 66, 0.05);
  }

  .accountInfo-lists li .items {
    overflow: hidden;
    min-height: 40px;
    display: flex;
    align-items: center;
  }

  .accountInfo-lists li .items > div {
    font-size: 18px;
    text-align: left;
    box-sizing: border-box;
    line-height: 22px;
    white-space: nowrap;
    word-break: break-all;
    padding: 0 4px;
    width: 185px;
    text-overflow: ellipsis;
    overflow: hidden;
    align-items: center;
  }

  .accountInfo-lists li .items > div.ico {
    min-width: 60px;
    width: 60px;
  }

  .accountInfo-lists.pandect li .items > div {
    width: 150px;
  }

  .accountInfo-lists li .items .ico {
    img {
      max-width: 50px;
      max-height: 50px;
    }
  }

  .accountInfo-lists.header li {
    border-bottom: none;
  }

  .accountInfo-lists.header li .items > div {
    display: flex;
  }

  .accountInfo-lists li .items > div .btn {
    display: inline-block;
    height: 22px;
    padding: 0;
    line-height: 22px;
    font-size: 24px;
    color: #0D66EF;
    text-align: left;
    cursor: pointer;
  }

  .accountInfo-lists li .items > div .btn:hover {
    color: #0847a9;
  }

  .accountInfo-lists li .items > div .cur {
    background-color: #e8b342;
    border-color: #e8b342;
    color: #fff;
  }

  .accountInfo-lists li .items > div .disabled {
    cursor: not-allowed;
    color: #ababab;
  }

  .accountInfo-lists li .items > div .disabled:hover {
    color: #ababab;
  }

  .accountInfo-lists li .items > div .active {
    border: none;
    color: #fdb902;
  }

  .accountInfo-lists li .items > div.coin {
    /*flex: 1;*/
    text-align: left;
    width: 90px;
  }

  .accountInfo-lists li .items > div.coin .icon-checkbox {
    margin-left: 14px;
  }

  .accountInfo-lists li .items > div.coin img {
    vertical-align: middle;
    height: 16px;
    margin-right: 6px;
  }


  .accountInfo-lists li .items > div.coin > img {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }

  .accountInfo-lists li .items > div.useable {
    width: 130px;
  }

  .accountInfo-lists.pandect li .items > div.useable {
    width: 130px;
  }


  .accountInfo-lists li .items > div.opreat {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }

  .accountInfo-lists li .items > div.action {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    width: auto;
  }

  .acount_tab {
    height: 50px;
    display: flex;
    font-size: 16px;
    position: relative;
  }

  .acount_tab > div {
    width: 190px;
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    border-top-right-radius: 10px;
    text-align: center;
    line-height: 50px;
    color: #808080;
    cursor: pointer;
  }

  .acount_tab > div.active {
    background-color: #1571FF;
    border-color: #1571FF;
    color: #fff;
  }

  .acount_tab > div:hover {
    /*color: #333;*/
  }

  .acount_tab > div.active:hover {
    color: #fff;
  }

  .acount_tab > span {
    position: absolute;
    right: 20px;
    height: 50px;
    line-height: 50px;
    color: #1571FF;
    cursor: pointer;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .accountInfo-lists {
      flex: 1;
    }

    .echart {
      width: 190px;
      height: 300px;
    }
  }

  .tab_cont {

    & > div {
      border: 1px solid rgba(238, 238, 238, 1);

      li {
        padding: 20px;
        border-bottom: 1px solid #eeeeee;
      }
    }

    .thead {
      height: 50px;
      background: rgba(238, 238, 238, 1);
      border-radius: 4px 4px 0px 0px;
      font-size: 18px;
      line-height: 50px;
      text-indent: 20px;
      color: #333333;
      display: flex;
      align-items: center;

      p {
        &:first-child {
          text-indent: 40px;
        }

        width: 185px;

      }
    }
  }

  .back:hover {
    cursor: pointer;
    color: #00a0e9;
  }

</style>

