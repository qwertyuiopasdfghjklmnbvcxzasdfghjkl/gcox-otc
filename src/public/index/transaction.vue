<template>
    <div class="warm">
      <div class="top">
        <p class="w1200">{{$t('gcox_otc.get_cny_in_china')}}</p>
      </div>
      <div class="cont">
        <div>
          <p>{{$t('exchange.exchange_amount')}}BTC：*</p>
          <label>
            <numberbox :accuracy="8"></numberbox>
            <span>Max</span>
          </label>
          <small>≈</small>
        </div>
        <div>
          <p>{{$t('exchange.exchange_amount')}}CNY:</p>
          <numberbox></numberbox>
          <button class="red_button">{{$t('exchange.exchange_sell')}}</button>
        </div>
      </div>
      <div class="box">
        <p class="title">{{$t('gcox_otc.advertising_details')}}</p>
        <table>
          <tr>
            <td>{{$t('gcox_otc.pay_to')}}</td>
            <td>HUZHENGGUO</td>
          </tr>
          <tr>
            <td>{{$t('exchange.exchange_price')}}</td>
            <td><b><span class="green">68.04412</span> CNY/BTC</b></td>
          </tr>
          <tr>
            <td>{{$t('gcox_otc.limit_number')}}</td>
            <td><b><span class="radius">0.21541 BTC</span> - <span class="radius">1.20245 BTC</span></b></td>
          </tr>
          <tr>
            <td>{{$t('gcox_otc.payment_method')}}</td>
            <td>银行转账: 招商银行 - China merchants bank</td>
          </tr>
          <tr>
            <td>{{$t('gcox_otc.address')}}</td>
            <td>中国</td>
          </tr>
          <tr>
            <td>{{$t('gcox_otc.pay_window')}}</td>
            <td>15 分钟</td>
          </tr>
        </table>
      </div>
    </div>
</template>

<script>
  import Numberbox from '../../components/formel/numberbox'
  export default {
    name: 'transaction',
    components: {Numberbox},
    data () {
      return {}
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped lang="less">
.top{
  height: 120px;
  background: #13143A;
  overflow: auto;
  p{
    color: #ffffff;
    font-size: 24px;
    margin-top: 45px;
  }
}
  .cont{
    width: 500px;
    margin: 30px auto;
    border-bottom: 1px solid #eeeeee;
    padding: 20px;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    div{
      width: 190px;
      font-size: 16px;
      color: #333333;
      p{
        margin: 10px 0;
      }
      input{
        padding: 15px 10px;
        border: 1px solid #eeeeee;
        border-radius:4px;
      }
      small{
        padding-top: 6px;
        font-size: 14px;
      }
      label{
        position: relative;
        display: block;
        span{
          position: absolute;
          top: 2px;
          right: 2px;
          width: 50px;
          height: 42px;
          background: #13143A;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius:2px;
          color: #ffffff;
        }
      }
      button{
        width:190px;
        height:50px;
        border-radius:3px;
        color: #ffffff;
        margin-top: 40px;
      }
    }
  }
  .box{
    width: 540px;
    margin: 30px auto;
    .title{
      background: #13143A;
      text-align: center;
      line-height: 50px;
      color: #ffffff;
    }
    table{
      width: 540px;
      td{
        border: 1px solid #eeeeee;
        padding: 15px;
      }
    }
  }
  .radius{
    border-radius: 15px;
    background: #F0B936;
    color: #ffffff;
    padding: 2px 6px;
  }
</style>
