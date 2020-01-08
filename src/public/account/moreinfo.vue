<template>
  <div class="moreinfo">
    <div class="depositBox">
      <div class="filed">
        <div class="lists active">
          <div class="name2">
            <div class="">
              <span class="ewm recharge yellow_button"
                    :class="{disabled: Number(item.rechargeFlag) !== 1}"
                    @click="Number(item.rechargeFlag) !== 1 ? false : scanEWM()"
                    :title="$t('account.estimated_value_deposit')">
                                {{$t('usercontent.user71')}}<!--充值-->
                            </span>
              <span class="reche icon_withdraw "
                                         :class="{disabled: Number(item.withdrawFlag) !== 1}"
                                         @click="Number(item.withdrawFlag) !== 1 ? false : withdrawDalog()"
                                         :title="$t('account.estimated_value_withdrawal')">
                                {{$t('usercontent.user70')}}<!--提现-->
                            </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import userUtils from '@/api/wallet'
  import utils from '@/assets/js/utils'
  import adressCava from './adresscava'
  import memoCava from './memocava'
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import stakeDialog from '@/public/account/stakeDialog'
  import withdrawInfo from './withdrawInfo'

  const copyText = (str) => {
    var save = function (e) {
      e.clipboardData.setData('text/plain', str)
      e.preventDefault()
    }
    document.addEventListener('copy', save)
    document.execCommand('copy')
    document.removeEventListener('copy', save)
  }
  export default {
    props: {
      mobileState: {
        type: Number,
        default: 0
      },
      item: {
        type: Object
      },
      symbol: {
        type: String
      },
      allData: {
        type: Array
      }
    },
    components: {
      adressCava
    },
    data () {
      return {
        disabled: false,
        dataWallet: [],
        show: false,
        EOS_MEMO: ''
      }
    },
    computed: {
      ...mapGetters(['getMarketList']),
      blockQuantity () {
        if (this.item.blockConfirm) {
          return this.item.blockConfirm
        }
        return this.item.symbol === 'BTC' ? 6 : 30
      },
      getAddress () {
        return this.symbol === 'EOS' ? this.EOS_MEMO : this.item.address
      }
    },
    created () {
      if (this.symbol === 'EOS' && !this.EOS_MEMO) {
        this.getEosAddress()
      }
    },
    methods: {
      ...mapGetters(['getUserInfo', 'getLang']),
      showStake () {
        if (!this.item.openStaking) {
          return
        }
        utils.setDialog(stakeDialog, {
          data: this.item,
          backClose: true,
          okCallback: () => {
            this.$parent.getList()
          }
        })
      },
      getEosAddress () {
        userUtils.getEosAddress(data => {
          this.EOS_MEMO = data
        })
      },
      copy () {
        Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public33')}) // 复制成功
        copyText(this.getAddress)
      },
      copy_memo () {
        Vue.$koallTipBox({icon: 'success', message: this.$t('public0.public33')}) // 复制成功
        copyText(this.item.address)
      },
      detWallet (item) {
        if (item.type === 1) {
          return
        }
        userUtils.defaultWallet({
          accountId: item.accountId,
          symbol: item.symbol
        }, (msg) => {
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
          this.dataWallet.forEach((d) => {
            if (item.accountId === d.accountId) {
              d.type = 1
            } else {
              d.type = 0
            }
          })
        }, (msg) => {
          Vue.$koallTipBox({icon: 'error', message: this.$t(`error_code.${msg}`)})
        })
      },
      withdrawDalog () {
        let data = {
          symbol: this.item.symbol,
          symbolType: this.item.symbolType,
          available: this.item.availableBalance,
          fromAddress: this.getAddress,
          procedure: this.item.procedureFee,
          minWithdraw: this.item.minWithdraw,
          fromAccount: this.item.accountId,
        }
        utils.setDialog(withdrawInfo, {
          item: data,
          all_data: this.allData,
          okCallback: () => {
            this.$emit('updateMyAssets')
          }
        })
      },
      scanEWM () {
        utils.setDialog(adressCava, {paramSymbol: this.symbol, item: this.item})
      },
      buy () {
        let market = this.getMarketList.filter(item => {
          return item.currencySymbol === this.symbol
        })
        if (market.length) {
          this.$router.push({
            name: 'exchange_index',
            params: {symbol: `${market[0].currencySymbol}_${market[0].baseSymbol}`}
          })
        } else {
          this.$router.push({name: 'exchange_index2'})
        }
      },
      scanMEMO () {
        utils.setDialog(memoCava, {
          addr: this.item.address,
          symbol: this.item.symbol
        })
      },
    }
  }
</script>
<style scoped>
  .important-tips {
    position: absolute;
    bottom: -18px;
    left: 0px;
    font-size: 12px;
    line-height: 22px;
    background-color: #343d53;
    color: #666;
    padding: 0 4px;
  }

  .moreinfo {
    padding: 8px;
  }

  .depositBox {
    /*background-color: #F5F5F5;*/
    /*border-radius: 4px;*/
  }

  .depositBox .filed {
    width: 100%;
  }

  .depositBox .filed ul.number {
    border: none;
    margin-top: 0px;
    display: inline-block;
    vertical-align: top;
  }

  .depositBox .filed ul li {
    overflow: hidden;
    border: none;
  }

  .depositBox .filed ul li.active div {
    color: #666;
  }

  .depositBox .filed ul li span {
    float: left;
    border: none;
    width: 130px;
    text-align: center;
    color: #d6dff9;
    display: inline-block;
  }

  .depositBox .filed ul li span.sum {
    width: 169px;
    text-align: left;
  }

  .depositBox .filed ul li span.yue {
    width: 169px;
    text-align: left;
  }

  .depositBox .filed ul li span.xiadan {
    width: 172px;
    text-align: left;
  }

  .depositBox .filed ul li span.guzhi {
    width: 180px;
    text-align: left;
  }

  .depositBox .filed label {
    display: inline-block;
    font-size: 14px;
    color: #333;
    width: 168px;
    text-align: center;
  }

  .depositBox .filed label.active {
    width: 350px;
    text-align: left;
    color: #333;
  }

  .depositBox .filed label.sum {
    width: 164px;
    text-align: left;
  }

  .depositBox .filed label.yue {
    width: 164px;
    text-align: left;
  }

  .depositBox .filed label.xiadan {
    width: 172px;
    text-align: left;
  }

  .depositBox .filed label.guzhi {
    width: 130px;
    text-align: left;
  }

  .depositBox .filed > div {
    line-height: 40px;
    position: relative;
  }

  .depositBox .filed > div.add {
    background-color: #e9b342;
    cursor: pointer;
    border: none;
    text-align: center;
    box-sizing: border-box;
    margin-top: 10px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    color: #0b0c0e;
    width: 250px;
    margin-bottom: 10px;
    float: left;
    font-size: 14px;
    margin-left: 52px;
  }

  .depositBox .filed > div .left {
    display: inline-block;
    width: 306px;
  }

  .depositBox .filed > div .tit {
    overflow: hidden;
    height: 40px;
    line-height: 40px;
    margin-left: 10px;
    position: relative;
  }

  .depositBox .filed > div .name {
    font-size: 12px;
    color: #d6dff9;
    height: 30px;
  }

  .depositBox .filed > div.active {
    /*margin-left: 20px;*/
  }

  .depositBox .filed > div.lists {
    line-height: 20px;
  }

  .depositBox .filed > div.lists.active ul.number {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.active span.sum {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.active span.yue {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.active span.xiadan {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.active span.guzhi {
    background-color: transparent;
  }

  .depositBox .filed > div.lists.name2 {
    display: inline-block;
  }

  .depositBox .filed > div.lists.name2 .name {
    font-size: 24px;
    color: #d6dff9;
    margin-top: 5px;
  }

  .depositBox .filed > div.lists.name2 .name3 {
    margin-left: 44px;
    margin-bottom: 5px;
  }

  .depositBox .filed > div.lists.name2 .name3 span {
    display: inline-block;
    font-size: 16px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    background-color: #fdb902;
    color: #fff;
    text-align: center;
  }

  .depositBox .filed > div.lists.name2 .name3 span.reche.disabled {
    background-color: #464c5c;
    cursor: not-allowed;
  }

  .depositBox .filed > div.adr-list {
    margin-left: 28px;
  }

  .addBNB {
    height: inherit;
    margin-left: 20px;
  }

  .addBNB .add, .addBNB.space {
    background-color: #fdb902;
    color: #fff;
    margin-left: 44px;
    vertical-align: top;
    cursor: pointer;
    border: none;
    text-align: center;
    box-sizing: border-box;
    margin-top: 10px;
    height: 24px;
    line-height: 24px;
    padding: 0 10px;
    width: 170px;
    margin-bottom: 10px;
    display: inline-block;
    font-size: 14px;
  }

  .addBNB .space {
    background-color: #464c5c;
    cursor: not-allowed;
  }

  .depositBox .filed input {
    box-sizing: border-box;
    height: 28px;
    line-height: 28px;
    padding: 0px 7px 0px 0px;
    border: 1px solid #d4d4d4;
    color: #333;
    width: 250px;
  }

  .depositBox .filed input.adressName {
    width: 470px;
    height: 30px;
    line-height: 30px;
    text-indent: 8px;
    margin-left: 10px;
    border: 1px solid #8CB4F2;
    margin-right: 8px;
    display: inline-block;
    padding: 0px;
    color: #666;
    font-size: 14px;
    vertical-align: top;
    background-color: #D3E2FA;
  }

  .depositBox .filed input.adressName:disabled {
    cursor: not-allowed;
  }

  .depositBox .filed span {
    height: 40px;
    padding: 10px 20px;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    vertical-align: text-bottom;
    position: relative;
    border-radius: 3px;
    margin-left: 26px;
  }
  .depositBox .filed span:first-child{
    margin-left: 0;
  }

  .depositBox .filed span.disabled {
    cursor: no-drop;
    opacity: 0.6;
  }

  .depositBox .filed span.icon_withdraw {

    border: 1px solid #333333;
  }

  .depositBox:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
  }

  .depositBox .ewm {
    height: 95px;
  }

  .depositBox .ewm canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .moreinfo .tips {
    margin-bottom: 15px;
    display: inline-block;
    margin-left: 10px;
    margin-top: 15px;
  }

  .moreinfo .tips li {
    height: 21px;
    line-height: 21px;
    list-style-type: square;
    font-size: 12px;
    color: #666;
    border: none;
  }

  .moreinfo .tips li .recoreds {
    font-size: 12px;
    color: #d6dff9;
    font-weight: bold;
    text-decoration: underline;
  }

  .moreinfo .tips li a {
    color: #fdb902 !important;
  }

  .moreinfo form .filed {
    margin-bottom: 20px;
    position: relative;
    padding-left: 130px;
    height: 30px;
  }

  .moreinfo form .filed label {
    display: inline-block;
    font-size: 12px;
    color: #d6dff9;
    width: 150px;
    height: 30px;
    line-height: 30px;
    text-align: right;
    position: absolute;
    left: -25px;
    top: 0;
  }

  .moreinfo form .filed input.ipt {
    box-sizing: border-box;
    width: 494px;
    height: 30px;
    padding: 0 10px;
    border: 1px solid #d4d4d4;
    color: #333;
  }

  .moreinfo form .filed input.defineValidateError {
    border: 1px solid #ff5252 !important;
  }

  .moreinfo form .filed .select input {
    box-sizing: border-box;
    width: 494px;
    height: 30px;
    padding: 0 10px;
    border: 1px solid #d4d4d4;
    color: #333;
  }

  .moreinfo form .filed .select .icon-downsj {
    position: absolute;
    right: 1px;
    top: 1px;
    z-index: 10;
    height: 28px;
    line-height: 29px;
    margin: 0;
    width: 28px;
    text-align: center;
    border-left: 1px solid #d4d4d4;
    cursor: pointer;
    background-color: #fff;
  }

  .moreinfo form .filed .defineValidate {
    position: absolute;
    bottom: -16px;
    left: 132px;
    font-size: 12px;
    color: #ff5252;
  }
</style>
