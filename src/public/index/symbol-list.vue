<template>
  <div class="cont" @click="show=false">
    <div class="swrap">
      <swiper :options="swiperOption">
        <swiper-slide class="swiper-slide" v-for="(item,index) in slide" :key="index">
          <div class="img_box">
            <img :src="showImg(item)">
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="list_box">
      <ul>
        <li v-for="item in symbolList">
          <list-box :item="item"/>
        </li>
      </ul>
    </div>
    <div class="w1200 check">
      <ul class="check_symbol">
        <li v-for="item in ts" :class="{active: item.symbol === t.symbol}"
            @click="change(item)">
          <p>
            <cryptoicon :symbol="item.symbol" size="40"/>
            <span>{{item.caption}}</span>
          </p>
        </li>
      </ul>

      <div class="box">
        <flash-order :params="params" :buyCur="buyCur"/>
        <flash-order-sell :params="params" :sellCur="sellCur"/>
      </div>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Inputbox from '../../components/formel/inputbox'
  import Numberbox from '../../components/formel/numberbox'
  import otcApi from '@/api/otc'
  import individual from '@/api/individual'
  import marketApi from '@/api/market'
  import numUtils from '@/assets/js/numberUtils'
  import config from '@/assets/js/config'
  import {mapGetters} from 'vuex'
  import ListBox from './list-box'
  import FlashOrder from './flashOrderBuy'
  import FlashOrderSell from './flashOrderSell'

  export default {
    components: {FlashOrderSell, FlashOrder, ListBox, Numberbox, Inputbox},
    props: ['params', 'buyCur', 'sellCur'],
    data () {
      return {
        show: false,
        state: 0,
        t: this.params,
        ts: [],
        slide: [],
        swiperOption: {
          //自动轮播
          autoplay: {
            delay: 10000
          },
          //开启循环模式
          loop: true,
        },
        symbolList: []
      }
    },
    computed: {
      ...mapGetters(['getLang', 'getSymbol', 'getCurrency', 'getUserInfo', 'getApiToken']),
      paramsChange () {
        return {
          currency: this.params.currency,
          symbol: this.t.symbol
        }
      }
    },
    watch: {},
    created () {
      this.getList()
      this.getInfo()
      this.getBanners()
    },
    methods: {
      getBanners () {
        individual.getBannersList(res => {
          console.log(res)
          this.slide = res
        })
      },
      showImg (data) {
        let src = data['activityImgUrl']
        switch (this.getLang) {
          case 'zh-CN':
            src = data['activityImgUrl']
            break
          case 'en':
            src = data['activityImgUrlEn']
            break
        }
        // config.origin +
        return src
      },
      change (data) {
        this.t = data
        this.t.currency = this.params.currency
        this.getInfo()
        this.$emit('change', this.t)
      },
      getList () {
        otcApi.getCoinsList(res => {
          this.ts = res
          this.symbolList = []
          this.ts.map(res => {
            this.symbolList.push(res)
          })
          window.localStorage.symbolList = JSON.stringify(res)
        })
      },
      getInfo () {
        otcApi.getCoinMarket(this.paramsChange, res => {
          this.curPrice = numUtils.BN(res[0].price).toFixed(6)
          console.log(res)
        })
      }
    }

  }
</script>

<style scoped lang="less">

  .swrap {
    width: 100%;
    height: 45%;
    font-size: 50px;
    text-align: center;
    /*background-color: #13143A;*/
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .swiper-slide {
      width: 100%;
      height: 100%;

      img {
        min-height: 100%;
        min-width: 100%;
      }
    }
  }

  .cont {
    height: calc(~'100vh - 60px');
    min-height: 880px;
    background: #13143A;
    overflow: auto;
    position: relative;
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
    position: relative;
    display: flex;
    height: calc(100% - 120px);
    justify-content: space-between;
    color: #ffffff;

    div {
      flex: 1;
      background: #1A1B42;
      border-radius: 6px;
      padding: 3vh 50px;
      margin: 0 20px;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

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

      .row_box {
        line-height: 32px;
        margin-top: 1vh;
        display: flex;

        span {
          &:first-child {
            width: 120px;
          }

          &:last-child {
            flex: 1;

            input {
              border: 1px solid #292A57;
              background: transparent;
              border-radius: 4px;
              width: 100%;
              height: 40px;
              text-indent: 10px;
              color: #ffffff;
              font-size: 18px;
              font-weight: bold;
              padding: 0;
            }
          }

          padding-left: 0;
        }
      }

      button {
        margin-top: 2vh;
        height: 50px;
        width: 100%;
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
      text-indent: 10px;

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

  .list_box {
    width: 100%;
    height: 210px;
    position: absolute;
    z-index: 999;
    left: 0;
    top: calc(~'45% - 100px');

    ul {
      display: flex;
      justify-content: center;
      align-items: center;

      li {
        background: #191A40;
        flex: 1;
        margin: 0 10px;
        height: 210px;
        border-radius: 10px;
        transition: 0.3s;
        overflow: hidden;
        position: relative;
        max-width: 300px;

        &:hover {
          background: #363766
        }
      }
    }

  }

  .check {
    position: relative;
    left: 0;
    top: calc(~'45% + 110px');
    height: calc(~'55% - 140px');

    .check_symbol {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 15px 0;

      li {
        height: 100px;
        background: #191A40;
        border-radius: 8px;
        margin-left: 12px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        &:first-child {
          margin-left: 0;
        }

        p {
          text-align: center;

          span {
            display: block;
            color: #ffffff;
          }
        }
      }

      .active {
        background: #363766;
      }
    }
  }
</style>
