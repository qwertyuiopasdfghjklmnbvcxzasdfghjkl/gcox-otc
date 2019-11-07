<template>
  <ul>
    <li v-for="data in datas">
      <div>
        <h6><span :class="type === 'sell'? 'red': 'green'">{{data.cur_price}}</span> {{data.currency}}/{{data.symbol}}
        </h6>
        <p>{{$t('gcox_otc.max')}}： {{data.max_amount}} {{data.currency}}</p>
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
        <button :class="type === 'sell'? 'red_button':'green_button'" @click="sub(data)">
          {{type === 'sell'? $t('gcox_otc.sell'): $t('gcox_otc.buy')}}
        </button>
      </div>
    </li>
    <slot></slot>
  </ul>
</template>

<script>
  import avatar from '@/assets/images/touxiang.png'

  export default {
    name: 'list-box',
    props: ['datas', 'type'],
    data () {
      return {
        avatarUrl: avatar,
      }
    },
    created () {

    },
    methods: {
      sub (d) {
        this.$emit('submit', d)
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
    &>div:nth-child(1){
      width: 220px;
    }
    &>div:nth-child(2){
      width: 320px;
    }
    &>div:nth-child(3){
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
      }
    }
  }
  .status{
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #9d9fa7;
    border-radius:50%;
    margin-right: 6px;
    &.active{
      background: #00aeef;
    }
  }
</style>
