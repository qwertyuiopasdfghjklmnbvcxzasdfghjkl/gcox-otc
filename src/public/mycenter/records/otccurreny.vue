<template>
  <div class="otccurreny">
    <div class="record">
      <div class="filtrate" >
        <div class="time">
          <label>{{$t('trade_record.trade_record_time')}}：<!--时间--></label>
          <datepicker :language="curLang" format="yyyy-MM-dd" v-model="dateTimeBegin"></datepicker>
          <span class="joint">-</span>
          <datepicker :language="curLang" format="yyyy-MM-dd" v-model="dateTimeEnd"></datepicker>
        </div>
        <div class="market">
          <label>{{$t('trade_record.trade_record_currency')}}：<!--币种--></label>
          <select v-model="symbol">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
        </div>
        <div class="direction">
          <label>{{$t('trade_record.trade_record_type')}}：<!--方向--></label>
          <select v-model="trade_type">
            <option value="">{{$t('trade_record.trade_record_all')}}<!--全部--></option>
            <option value="1">{{$t('trade_record.trade_record_buy')}}<!--买--></option>
            <option value="2">{{$t('trade_record.trade_record_sell')}}<!--卖--></option>
          </select>
        </div>
        <div class="button">
          <button class="search" @click="getTrade">{{$t('trade_record.trade_record_search')}}<!--搜索--></button>
          <button class="reset" @click="clearTrade">{{$t('trade_record.trade_record_reset')}}<!--重置--></button>
        </div>
        <div class="operation export" :class="{disabled: tradeData.length === 0}">
          <a href="javascript:;" @click="tradeData.length === 0 ? false : onExportRecord()">{{$t('trade_record.trade_record_export')}}<!--导出报表--></a>
          <i class="icon-reports"></i>
        </div>
      </div>
      <h3>{{$t('trade_record.otc_record')}}<!--OTC交易记录--></h3>
      <ul class="otc header" v-if="!tradeLoading && tradeData.length > 0">
        <li>
          <span class="number">{{$t('otc_exchange.otc_exchange_order_number')}}<!--订单编号--></span>
          <span class="type">{{$t('exchange.exchange_type')}}<!--类型--></span>
          <span class="status">{{$t('exchange.exchange_status')}}<!--状态--></span>
          <span class="currency">{{$t('account.estimated_value_coin')}}<!--币种--></span>
          <span class="price">{{$t('otc_exchange.otc_exchange_ask')}}<!--单价--></span>
          <span class="volume">{{$t('exchange.exchange_amount')}}<!--数量--></span>
          <span class="sum">{{$t('exchange.exchange_total')}}<!--金额--></span>
          <span class="charge">{{$t('exchange.advanced_fee')}}<!--手续费--></span>
          <span class="ordersTime">{{$t('otc_ad.otc_ad_end_time')}}<!--完成时间--></span>
        </li>
      </ul>
      <ul class="otc" v-if="!tradeLoading && tradeData.length > 0">
        <li class="list" v-for="data in tradeData" :key="data.id">
          <span class="number">{{data.order_number}}<!--订单编号--></span>
          <span class="type" :class="data.to_user_name === getUserInfo.username ? 'buy' : 'sell'">{{data.to_user_name === getUserInfo.username ? $t('otc_exchange.otc_exchange_buy') : $t('otc_exchange.otc_exchange_sell')}}<!--类型--></span>
          <span class="status">{{getOrderState(data.state)}}<!--状态--></span>
          <span class="currency">{{data.symbol}}<!--币种--></span>
          <span class="price">{{toFixed(data.cur_price, 2)}} {{data.currency}}<!--单价--></span>
          <span class="volume">{{toFixed(data.symbol_count)}} {{data.symbol}}<!--数量--></span>
          <span class="sum">{{toFixed(data.currency_count, 2)}} {{data.currency}}<!--金额--></span>
          <span class="charge">{{toFixed(data.order_fee, 8)}} {{data.symbol}}<!--手续费--></span>
          <span class="ordersTime">{{data.updated_at}}<!--完成时间--></span>
        </li>
      </ul>
      <page v-if="!tradeLoading && tradeData.length > 0" :pageIndex="params.page" :pageSize="params.show" :total="params.total" @changePageIndex="pageChange"/>
      <div class="nodata" v-if="!tradeLoading && tradeData.length === 0">
        <div class="nodata-icon icon-no-order"></div>
        <div class="nodata-text">{{$t('trade_record.not_otc_record')}}<!--暂无OTC交易记录--></div>
      </div>
      <loading v-if="tradeLoading"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Datepicker from 'vuejs-datepicker'
import { en, zh } from 'vuejs-datepicker/dist/locale'
import otcApi from '@/api/otc'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import page from '@/components/page'
import loading from '@/components/loading'
import exportRecord from '@/public/dialog/exportrecord'
export default {
  components: {
    Datepicker,
    page,
    loading
  },
  data () {
    return {
      fixedNumber: 8,
      order_number: '',
      trade_type: '', // 交易类型 1 购买 2 出售
      state: '',
      cur_price: '',
      currency: '',
      symbol_count: '',
      currency_count: '',
      updated_at: '',
      dateTimeEnd: null,
      dateTimeBegin: null,
      symbol: '', // 币种
      ad_id: '',
      tradeData: [],
      params: {
        page: 1,
        show: 6,
        total: 0
      },
      tradeLoading: true
    }
  },
  computed: {
    ...mapGetters(['getLang', 'getApiToken', 'getUserInfo']),
    curLang () {
      return this.getLang === 'en' ? en : zh
    },
    paramsChange () {
      return {
        direction: 2,
        page: this.params.page,
        pageSize: this.params.show
      }
    }
  },
  created () {
    this.chooseTrade()
  },
  methods: {
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
    },
    clearTrade () {
      this.dateTimeBegin = null
      this.dateTimeEnd = null
      this.trade_type = ''
      this.symbol = ''
      this.params.page = 1
      this.chooseTrade()
    },
    pageChange (currentIndex) {
      this.params.page = currentIndex
      this.chooseTrade()
    },
    onExportRecord () {
      utils.setDialog(exportRecord, {
        exportMarket: 'OTC',
        lang: this.getLang === 'zh-CN' ? 'chs' : this.getLang
      })
    },
    getTrade () {
      this.params.page = 1
      this.chooseTrade()
    },
    chooseTrade () {
      this.tradeLoading = true
      otcApi.getOrdersList({
        state: 2, // 已完成
        begin_date: this.dateTimeBegin ? this.dateTimeBegin.format('yyyy-MM-dd') : null,
        end_date: this.dateTimeEnd ? this.dateTimeEnd.format('yyyy-MM-dd') : null,
        trade_type: this.trade_type ? this.trade_type : null, // 买 卖
        symbol: this.symbol ? this.symbol : null, // 市场
        page: this.params.page,
        show: this.params.show
      }, (data, time, total) => {
        this.params.total = total
        this.tradeData = data
        this.tradeLoading = false
      }, (msg) => {
        console.error(msg)
      })
    },
    getOrderState (state) { // 获取订单状态
      if (parseInt(state) === 1) {
        return this.$t('public0.public14') // 交易中
      } else if (parseInt(state) === 2) {
        return this.$t('otc_ad.otc_ad_completed') // 已完成
      } else if (parseInt(state) === 3) {
        return this.$t('public0.public25') // 已取消
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.otccurreny /deep/ .filtrate,
.otccurreny /deep/ .filtrate > div{display: flex;align-items: center;}
.otccurreny /deep/ .filtrate{height: 54px;background-color: #FFF; margin-left: 40px; margin-right: 40px;}
.otccurreny /deep/ .filtrate > div{margin-right: 14px;}
.otccurreny /deep/ .filtrate .operation{margin-right: 0;cursor: pointer;}
.otccurreny /deep/ .filtrate .allrepeal,
.otccurreny /deep/ .filtrate .export{margin-left: auto;}
.otccurreny /deep/ .filtrate label{font-size: 14px;color: #333;}
.otccurreny /deep/ .filtrate input{height: 22px;font: 12px/normal "Microsoft YaHei";color: #666;border: 1px solid #5699FF; border-radius: 3px;}
.otccurreny /deep/ .filtrate .joint{width: 12px;font-size: 12px;color: #becbe8;text-align: center;}
.otccurreny /deep/ .filtrate select{width: 100px;height: 24px;padding-left: 4px;padding-right: 20px;font-size: 12px;color: #666;background: url(../../../assets/images/icon_arrowdown.png) no-repeat right 4px center;border: 1px solid #5699FF;cursor: pointer; border-radius: 3px;}
.otccurreny /deep/ .filtrate button{float: left;min-width: 38px;height: 24px;font-size: 12px;background-color: transparent;cursor: pointer;}
.otccurreny /deep/ .filtrate .time /deep/ input{width: 100px;padding-right: 24px;background: url(../../../assets/images/icon_calendar.png)  no-repeat right 4px center;cursor: pointer;}
.otccurreny /deep/ .filtrate .market input{width: 50px;}
.otccurreny /deep/ .filtrate .button button {min-width: 60px; border-radius: 3px;}
.otccurreny /deep/ .filtrate .button .search{margin-right: 14px;color: #fff;background-color: #00a0e9;}
.otccurreny /deep/ .filtrate .button .search:hover{background-color: #1a64d4;}
.otccurreny /deep/ .filtrate .button .reset{color: #999;border: 1px solid #ccc;}
.otccurreny /deep/ .filtrate .button .reset:hover{color: #666;border-color: #bbb;}
.otccurreny /deep/ .filtrate .operation a,
.otccurreny /deep/ .filtrate .operation i{font-size: 12px;color: #00a0e9;}
.otccurreny /deep/ .filtrate .operation i{padding-left: 8px;margin-top: 1px;}
.otccurreny /deep/ .filtrate .allrepeal i,
.otccurreny /deep/ .filtrate .export i{font-size: 14px;}
.otccurreny /deep/ .filtrate .operation:hover a,
.otccurreny /deep/ .filtrate .operation:hover i{color: #1a64d4;}
.otccurreny /deep/ .filtrate .hide a,.otccurreny /deep/ .filtrate .hide:hover a{color:#333;}
.otccurreny /deep/ .filtrate .disabled a,
.otccurreny /deep/ .filtrate .disabled i{color: #999;cursor: not-allowed;}
.otccurreny /deep/ .filtrate .disabled:hover a,
.otccurreny /deep/ .filtrate .disabled:hover i{color: #999;}

.otccurreny /deep/ h3{height: 35px;font-weight: normal;font-size: 14px;line-height: 35px;color: #333;padding: 0 20px; border-top: 1px solid #e7e7e7; border-bottom: 1px solid #e7e7e7;}

.otccurreny /deep/ .record{background-color: #fff;}
.otccurreny /deep/ .record ul{padding-left: 20px;padding-right: 20px;}
.otccurreny /deep/ .record ul.header{background:#F5F5F5;}
.otccurreny /deep/ .record ul li{border-bottom: 1px solid #eee;}
.otccurreny /deep/ .record ul.header li{border-bottom:none;}
.otccurreny /deep/ .record ul li span{display: inline-block;height: 40px;line-height: 40px;font-size: 12px;color: #555;white-space: nowrap;text-overflow: ellipsis;vertical-align: top;overflow: hidden;}

.otccurreny /deep/ .record ul li span.number{width: 160px;}
.otccurreny /deep/ .record ul li span.type{width: 50px;}
.otccurreny /deep/ .record ul li span.status{width: 80px;}
.otccurreny /deep/ .record ul li span.currency{width: 50px;}
.otccurreny /deep/ .record ul li span.price{width: 120px;}
.otccurreny /deep/ .record ul li span.volume{width: 120px;}
.otccurreny /deep/ .record ul li span.sum{width: 120px;}
.otccurreny /deep/ .record ul li span.charge{width: 100px;}
.otccurreny /deep/ .record ul li span.ordersTime{width: 120px;}
.otccurreny /deep/ .record ul li.list span.buy{color: #23CD09;}
.otccurreny /deep/ .record ul li.list span.sell{color: #F34246;}

.otccurreny /deep/ .record .nodata{text-align: center;}
.otccurreny /deep/ .record .nodata .nodata-icon{height: 80px;line-height: 80px;font-size: 40px;color: #A1A1A1;}
.otccurreny /deep/ .record .nodata .nodata-text{height: 40px;line-height: 20px;color: #A1A1A1;}
</style>

