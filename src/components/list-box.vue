<template>
  <ul>
    <li v-for="data in datas">
      <div>
        <h6><span :class="type === 'sell'? 'red': 'green'">{{data.cur_price}}</span> {{data.currency}}/{{data.symbol}}
        </h6>
        <p>{{$t('gcox_otc.limit_number')}}： {{data.min_amount}} - {{max(data)}}
          {{type === 'sell' ? data.symbol : data.currency}}</p>
      </div>
      <div>
        <h6><!--{{$t('gcox_otc.remain_count')}}：--> <b>
          <span :class="type === 'sell'? 'red': 'green'">{{data.remain_count}}</span>
          {{data.symbol}}</b></h6>
        <p></p>
      </div>
      <div>
        <!--<p>招商银行-China merchants</p>-->
        <p>
          <em class="wechat icon-paypal" :title="$t('public0.public219')"
              v-if="(data.pay_type||'').indexOf('4')!==-1"> {{$t('otc_ad.otc_ad_PayPal')}}</em><!--PayPal支付-->
          <em class="wechat icon-wechat" :title="$t('otc_ad.otc_ad_WeChatPay')"
              v-if="(data.pay_type||'').indexOf('3')!==-1"> {{$t('otc_ad.otc_ad_WeChatPay')}}</em><!--微信支付-->
          <em class="zfb icon-alipay" :title="$t('otc_ad.otc_ad_Alipay_pay')"
              v-if="(data.pay_type||'').indexOf('2')!==-1"> {{$t('otc_ad.otc_ad_Alipay_pay')}}</em><!--支付宝支付-->
          <em class="card icon-bank" :title="$t('otc_ad.otc_ad_BankPay')"
              v-if="(data.pay_type||'').indexOf('1')!==-1"> {{$t('otc_ad.otc_ad_BankPay')}}</em><!--银行卡支付-->
        </p>
        <p></p>
      </div>
      <div>
        <p :title="data.connect_fd ? $t('error_code.ONLINE'): $t('error_code.OFFLINE')">
          <i class="status" :class="{'active': data.connect_fd}"></i>{{data.nickname||data.username}}
        </p>
        <p>
          <img v-for="item in Math.floor(data.user_level/20||0)" src="../assets/img/star.png">
          <img v-for="item in (5 - Math.floor(data.user_level/20||0))" src="../assets/img/nostar.png">
        </p>
      </div>
      <div>
        <button :class="style(data)"
                @click="sub(data)">
          {{type === 'sell'? $t('otc_exchange.otc_exchange_sell'): $t('otc_exchange.otc_exchange_buy')}}
        </button>
      </div>
    </li>
    <slot></slot>
  </ul>
</template>

<script>
  import avatar from '@/assets/images/touxiang.png'
  import util from '../assets/js/numberUtils'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'list-box',
    props: ['datas', 'type'],
    data () {
      return {
        avatarUrl: avatar,
      }
    },
    computed: {
      ...mapGetters(['getUserInfo']),
    },
    created () {

    },
    methods: {
      sub (d) {
        this.$emit('submit', d)
      },
      max (data) {
        let n = ''
        if (this.type === 'sell') {
          n = Number(data.max_amount) > Number(data.remain_count) ? data.remain_count : data.max_amount
        } else {
          let m = util.mul(data.remain_count, data.cur_price)
          console.log(m, data)
          n = m > Number(data.max_amount) ? Number(data.max_amount) : m
        }
        return n
      },
      style (data) {
        console.log(data.from_user_id, this.getUserInfo.userId)
        let c = this.getUserInfo.userId === data.from_user_id ? 'disb' : ''
        let d = this.type === 'sell' ? 'red_button' : 'green_button'
        return c + ' ' + d
      }
    }

  }
</script>

<style scoped lang="less">
  li {
    background: #FBFBFB;
    border-left: 4px solid #eeeeee;
    padding: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 20px;

    & > div:nth-child(1) {
      width: 280px;
    }

    & > div:nth-child(2) {
      width: 180px;
    }

    & > div:nth-child(3) {
      width: 200px;
    }

    & > div:nth-child(4) {
      width: 320px;
    }

    & > button {
      width: 200px;
      height: 50px;
      border-radius: 4px;
      margin: 5px 0;
    }

    h6 {
      font-size: 18px;
      margin: 0;
      font-weight: 600;
    }

    div {
      p:last-child {
        margin-top: 10px;
      }

      p {
        img {
          margin-right: 6px;
        }
      }

      button {
        height: 40px;
        border-radius: 4px;
        color: #ffffff;
        &.disb{
          background: #686a77;
          cursor: no-drop;
        }
      }
    }
  }

  .status {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #9d9fa7;
    border-radius: 50%;
    margin-right: 6px;

    &.active {
      background: #00aeef;
    }
  }
</style>
