<template>
  <div class="w1200">
    <div class="top">
      <div>
        <h2>{{$t('gcox_otc.appraisement')}}：{{String(getBTCValuation).toMoney()}} BTC</h2>
        <h4>≈ {{getCoinSign}} {{USDCNY}}</h4>
      </div>
      <div>
        <button @click="toWallet()">{{$t('home.home50')+'/'+$t('home.home49')}}</button>
      </div>
    </div>
    <div class="ad-box ad-box-current">
      <p>{{$t('gcox_otc.your_buy_advertising')}}<!--你的购买广告--></p>
      <ul class="ad-list ad-list-current" v-if="!currentLoading && cDatas.length > 0">
        <li class="ad-list-item" v-for="item in cDatas" :key="item.ad_id">
          <p>
            <span class="ad-list-item-coin">{{$t('account.estimated_value_coin')}}<!--币种--></span>
            <span class="ad-list-item-type">{{$t('shop.payment')}}<!--支付方式--></span>
            <span class="ad-list-item-limit">{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
            <span class="ad-list-item-price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
            <span class="ad-list-item-surplus">{{$t('message.msg_surplus')}}<!--剩余--></span>
            <span class="ad-list-item-status">{{$t('otc_ad.otc_ad_status')}}<!--状态--></span>
          </p>
          <p>
            <span class="ad-list-item-coin">{{item.symbol}}</span>
            <span class="ad-list-item-type">
                <em class="wechat icon-paypal" :title="$t('public0.public219')"
                    v-if="(item.pay_type||'').indexOf('4')!==-1"> {{$t('otc_ad.otc_ad_PayPal')}}</em><!--PayPal支付-->
          <em class="wechat icon-wechat" :title="$t('otc_ad.otc_ad_WeChatPay')"
              v-if="(item.pay_type||'').indexOf('3')!==-1"> {{$t('otc_ad.otc_ad_WeChatPay')}}</em><!--微信支付-->
          <em class="zfb icon-alipay" :title="$t('otc_ad.otc_ad_Alipay_pay')"
              v-if="(item.pay_type||'').indexOf('2')!==-1"> {{$t('otc_ad.otc_ad_Alipay_pay')}}</em><!--支付宝支付-->
          <em class="card icon-bank" :title="$t('otc_ad.otc_ad_BankPay')"
              v-if="(item.pay_type||'').indexOf('1')!==-1"> {{$t('otc_ad.otc_ad_BankPay')}}</em><!--银行卡支付-->
              </span>
            <span class="ad-list-item-limit">{{item.min_amount}}-{{item.max_amount}} {{item.ad_type === 2 ? item.currency : item.symbol}}</span>
            <span class="ad-list-item-price">{{item.cur_price}} {{item.currency}}</span>
            <span class="ad-list-item-surplus">{{item.remain_count}} {{item.symbol}}</span>
            <span class="ad-list-item-status" :class="item.status===1?'green':'red'">{{$t(item.status===1?'public0.public51':'public0.public52')}}</span>
          </p>
        </li>
      </ul>
      <page v-if="!currentLoading && cDatas.length > 0" :pageIndex="form.page" :pageSize="form.show"
            :total="total" @changePageIndex="pageChange"/>

      <div class="ad-nodata">
        <div class="ad-nodata-text">{{$t('public0.public147')}}<!--暂无广告--></div>
      </div>
      <loading v-if="currentLoading"/>
    </div>
    <div class="ad-box ad-box-current">
      <p>{{$t('gcox_otc.your_sell_advertising')}}<!--你的销售广告--></p>
      <ul class="ad-list ad-list-current" v-if="!historyLoading && hDatas.length > 0">
        <li class="ad-list-item" v-for="item in hDatas" :key="item.ad_id">
          <p>
            <span class="ad-list-item-coin">{{$t('account.estimated_value_coin')}}<!--币种--></span>
            <span class="ad-list-item-type">{{$t('shop.payment')}}<!--支付方式--></span>
            <span class="ad-list-item-limit">{{$t('otc_exchange.otc_exchange_Trading_limits')}}<!--交易限额--></span>
            <span class="ad-list-item-price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
            <span class="ad-list-item-surplus">{{$t('message.msg_surplus')}}<!--剩余--></span>
            <span class="ad-list-item-status">{{$t('otc_ad.otc_ad_status')}}<!--状态--></span>
          </p>
          <p>
            <span class="ad-list-item-coin">{{item.symbol}}</span>
            <span class="ad-list-item-type">
                <em class="wechat icon-paypal" :title="$t('public0.public219')"
                    v-if="(item.pay_type||'').indexOf('4')!==-1"> {{$t('otc_ad.otc_ad_PayPal')}}</em><!--PayPal支付-->
          <em class="wechat icon-wechat" :title="$t('otc_ad.otc_ad_WeChatPay')"
              v-if="(item.pay_type||'').indexOf('3')!==-1"> {{$t('otc_ad.otc_ad_WeChatPay')}}</em><!--微信支付-->
          <em class="zfb icon-alipay" :title="$t('otc_ad.otc_ad_Alipay_pay')"
              v-if="(item.pay_type||'').indexOf('2')!==-1"> {{$t('otc_ad.otc_ad_Alipay_pay')}}</em><!--支付宝支付-->
          <em class="card icon-bank" :title="$t('otc_ad.otc_ad_BankPay')"
              v-if="(item.pay_type||'').indexOf('1')!==-1"> {{$t('otc_ad.otc_ad_BankPay')}}</em><!--银行卡支付-->
              </span>
            <span class="ad-list-item-limit">{{item.min_amount}}-{{item.max_amount}} {{item.ad_type === 2 ? item.currency : item.symbol}}</span>
            <span class="ad-list-item-price">{{item.cur_price}} {{item.currency}}</span>
            <span class="ad-list-item-surplus">{{item.remain_count}} {{item.symbol}}</span>
            <span class="ad-list-item-status" :class="item.status===1?'green':'red'">{{$t(item.status===1?'public0.public51':'public0.public52')}}</span>
          </p>
        </li>
      </ul>

      <page v-if="!historyLoading && hDatas.length > 0" :pageIndex="form1.page" :pageSize="form1.show"
            :total="total1" @changePageIndex="pageChange1"/>

      <div class="ad-nodata">
        <div class="ad-nodata-text">{{$t('public0.public147')}}<!--暂无广告--></div>
      </div>
      <loading v-if="historyLoading"/>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'
  import numUtils from '@/assets/js/numberUtils'
  import loading from '@/components/loading'
  import page from '@/components/page'

  export default {
    props: ['params'],
    components: {
      loading,
      page
    },
    data () {
      return {
        active: 'current',
        cDatas: [],
        hDatas: [],
        currentLoading: true,
        historyLoading: true,
        form: {
          page: 1,
          show: 6,
          ad_type: 1,
        },
        total: 0,
        form1: {
          page: 1,
          show: 6,
          ad_type: 2,
        },
        total1: 0,
      }
    },
    computed: {
      ...mapGetters(['getBTCValuation', 'getUSDCNY', 'getCoinSign', 'getApiToken']),
      USDCNY () {
        return numUtils.mul(this.getBTCValuation, this.getUSDCNY).toFixed(2).toMoney()
      }
    },
    watch: {
      getApiToken () {
        this.getList()
        this.getList1()
      },
    },
    created () {
      this.getList()
      this.getList1()
      // this.$nextTick(() => {
      //   this.addEvents({
      //     name: 'updateMyAds',
      //     fun: this.getList
      //   })
      // })
    },
    methods: {
      ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent', 'addEvents', 'removeEvents']),
      getList () {
        if (!this.getApiToken) {
          return
        }
        this.cDatas = []
        this.currentLoading = true
        otcApi.getMyAdvertisementList(this.form, (res, total) => {
          res.forEach((item) => {
            // 类型转换
            item.status = parseInt(item.status)
            item.ad_type = parseInt(item.ad_type)
            item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
            item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
          })
          this.cDatas = res
          this.total = total
          console.log(this.cDatas)
          this.currentLoading = false
        }, (msg) => {
          this.currentLoading = false
          console.error(msg)
        })
      },
      pageChange(e){
        this.form.page = e;
        this.getList()
      },
      getList1 () {
        if (!this.getApiToken) {
          return
        }
        this.hDatas = []
        this.historyLoading = true
        otcApi.getMyAdvertisementList(this.form1, (res, total) => {
          res.forEach((item) => {
            // 类型转换
            item.status = parseInt(item.status)
            item.ad_type = parseInt(item.ad_type)
            item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
            item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
          })
          this.hDatas = res
          this.total1 = total
          this.historyLoading = false
        }, (msg) => {
          this.historyLoading = false
          console.error(msg)
        })
      },
      pageChange1(e){
        this.form1.page = e
        this.getList1()
      },
      toWallet () {
        this.$router.push({name: 'control_wallet'})
      }
    }
  }
</script>

<style scoped lang="less">
  .ad-box {
    font-size: 16px;
    margin: 20px auto;
    min-height: 100px;
    position: relative;

    & > p {
      background: url("../../../src/assets/img/flag.png") no-repeat left center;
      padding-left: 30px;
      font-size: 20px;
      line-height: 40px;
    }

    .ad-list-item {
      background: #FBFBFB;
      border-left: 4px solid #eeeeee;
      padding: 22px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      margin-bottom: 20px;
      flex-flow: column;
      position: relative;
      z-index: 99;

      p {
        width: 100%;

        &:last-child {
          margin-top: 10px;
        }

        span {
          width: 16%;
          display: inline-block;
        }
      }
    }

    .ad-nodata {
      text-indent: 40px;
      position: absolute;
      top: 50px;
      color: #999999;
    }
  }

  .top {
    height: 120px;
    background: rgba(19, 20, 58, 1);
    border-radius: 3px;
    margin-top: 35px;
    padding: 20px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;

    h2 {
      font-weight: 400;
    }

    h4 {
      font-weight: 400;
      margin-top: 10px;
    }

    button {
      width: 200px;
      height: 60px;
      background: rgba(232, 179, 52, 1);
      border-radius: 3px;
      color: #ffffff;
    }
  }
</style>
