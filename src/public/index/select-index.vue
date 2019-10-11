<template>
  <div class="cont" @click="show=false">
    <div class="w1200">

      <div class="select">
        <p @click.stop="show=!show">
          <cryptoicon :symbol="t.img" size="40"/>
          <span>{{t.name}}</span>
          <i></i>
        </p>
        <ul v-if="show">
          <li v-for="item in ts" @click="change(item)">
            <p>
              <cryptoicon :symbol="item.img" size="40"/>
              <span>{{item.name}}</span>
            </p>
          </li>
        </ul>
      </div>

      <div class="box" v-if="state === 0">
        <div class="left-box">
          <p><img src="../../assets/img/buy.png"><span>{{$t('gcox_otc.sell_price')}}</span></p>
          <h4><span class="green">{{curPrice}}</span> CNY</h4>
          <button @click="state=1">{{$t('gcox_otc.now_buy')}}</button>
        </div>
        <div class="right-box">
          <p><img src="../../assets/img/sell.png"><span>{{$t('gcox_otc.buy_price')}}</span></p>
          <h4><span class="red">{{curPrice}}</span> CNY</h4>
          <button @click="state=2">{{$t('gcox_otc.now_sell')}}</button>
        </div>
      </div>

      <div class="buy_box" v-if="state === 1">
        <button class="yellow_button" @click="buy()">Create offer</button>
        <p @click="state=2">{{$t('gcox_otc.want').format($t('gcox_otc.sell'))}}Etheaeum ?</p>
      </div>

      <div class="buy_box" v-if="state === 2">
        <div class="input_box">
          <span>
            <numberbox :accuracy="8"></numberbox>
            <button>Max</button>
          </span>
          <span>
            <select>
              <option>-- --</option>
            </select>
          </span>
        </div>
        <button class="red_button" @click="sell()">Create offer</button>
        <p @click="state=1">{{$t('gcox_otc.want').format($t('gcox_otc.buy'))}}Etheaeum ?</p>
      </div>

    </div>
  </div>
</template>

<script>
  import Inputbox from '../../components/formel/inputbox'
  import Numberbox from '../../components/formel/numberbox'
  import otcApi from '@/api/otc'
  import numUtils from '@/assets/js/numberUtils'

  export default {
    name: 'select-index',
    components: {Numberbox, Inputbox},
    props: ['params'],
    data () {
      return {
        show: false,
        state: 0,
        t: this.params,
        ts: [
          {
            img: 'btc',
            name: 'Bitcoin',
            symbol: 'BTC'
          },
          {
            img: 'eth',
            name: 'Ethereum',
            symbol: 'ETH'
          },
          {
            img: 'usdt',
            name: 'Tether USDT',
            symbol: 'USDT'
          },
          {
            img: 'Cash',
            name: 'Bitcoin Cash',
            symbol: 'CASH'
          },
          {
            img: 'ltc',
            name: 'Litecoin',
            symbol: 'LTC'
          },
          {
            img: 'Litecoin',
            name: 'Ripple',
            symbol: 'RIPPLE'
          }
        ],
        curPrice: 0,
      }
    },
    computed: {
      paramsChange () {
        return {
          bench_marking_id: 1,
          currency: 'CNY',
          symbol: this.t.symbol
        }
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      change (data) {
        this.show = false
        this.t = data
        this.getInfo()
        this.$emit('change',data)
      },
      getInfo () {
        otcApi.getCoinMarket(this.paramsChange, res => {
          this.curPrice = numUtils.BN(res[0].price).toFixed(6)
          console.log(res)
        })
      },
      buy () {
      },
      sell () {
      },
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
