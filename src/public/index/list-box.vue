<template>
  <div class="echart_box" :class="{active: item.symbol === getSymbol.symbol}">
    <div class="data_box">
      <h4>{{item.symbol}} {{$t('public0.public158')}} <!--指数--></h4>
      <h2>
        <span :class="state">
        {{curPrice}}</span> {{getCurrency}}
        <!-- <small :class="state">{{percent}} %</small> -->
      </h2>
      <div class="text_flex">
        <p><span>{{$t('exchange.exchange_high')}}<!--24h最高价--></span><span>{{maxPrice||'0.00'}}</span></p>
        <p><span>{{$t('exchange.exchange_low')}}<!--24h最低价--></span><span>{{minPrice||'0.00'}}</span></p>
      </div>
    </div>
    <div class="line-box">
      <v-chart class="v_chart" ref="runTimes_creditChart" :options="polar"/>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import numUtils from '@/assets/js/numberUtils'
  import otcApi from '@/api/otc'

  export default {
    props: ['item'],
    data () {
      return {
        percent: null,
        curPrice: null,
        minPrice: null,
        maxPrice: null,
        polar: {
          animation: false,
          height: 70,
          width: '100%',
          grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '70px',
            width: '100%',
            show: false
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            show: false,
            data: [],
          },
          yAxis: {
            show: false,
            min: 'dataMin'
          },
          series: [{
            data: [],
            type: 'line',
            smooth: true,
            itemStyle: {opacity: 0},
            lineStyle: {color: 'rgb(48, 50, 101)', width: 3},
            areaStyle: {color: 'rgb(30, 31, 65)'}
          }]
        }
      }
    },
    computed: {
      ...mapGetters(['getLang', 'getSymbol', 'getCurrency', 'getUserInfo', 'getApiToken']),
      paramsChange () {
        return {
          bench_marking_id: 2,
          currency: this.getCurrency,
          symbol: this.item.symbol
        }
      },
      state () {
        return this.percent >= 0 ? 'green' : 'red'
      }
    },
    watch: {
      kline (e) {
        console.log(e)
        this.polar.series[0].data = e.sData
        this.polar.xAxis.data = e.xData
      },
      paramsChange () {
        this.getCoinMarket()
      }
    },
    created () {
      console.log(this.getSymbol)
      this.$nextTick(() => {
        this.getCoinMarket()
      })
    },
    methods: {
      getCoinMarket () {
        otcApi.getCoinMarket(this.paramsChange, (res) => {
          let priceArray = []
          let timeArray = []
          this.curPrice = numUtils.BN(res[0].price).toFixed(2)
          this.percent = res[0].percent_change_24h || 0
          res.reverse()
          res.forEach((item) => {
            priceArray.push(item.price)
            timeArray.push(item.time)
          })
          priceArray = priceArray.length ? priceArray : [0]
          if (this.isATN) {
            this.maxPrice = this.minPrice = this.curPrice
          } else {
            this.minPrice = numUtils.BN(Math.min.apply(null, priceArray)).toFixed(2)
            this.maxPrice = numUtils.BN(Math.max.apply(null, priceArray)).toFixed(2)
          }
          this.createCanvas(priceArray, timeArray)
        }, (msg) => {
          console.error(msg)
        })
      },
      createCanvas (sData, xData) {
        this.polar.series[0].data = sData
        this.polar.xAxis.data = xData
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        console.log(this.$refs.runTimes_creditChart)
        if (this.$refs.runTimes_creditChart) {
          this.$refs.runTimes_creditChart.resize()
        }
      })
    },
    beforeDestroy () {

    }
  }
</script>

<style scoped lang="less">
  .echart_box {
    position: absolute;
    width: 100%;
    height: 210px;
    transition: 0.3s;

    .data_box {
      padding: 15px;
      position: relative;
      z-index: 99;

      h4 {
        font-weight: 400;
        font-size: 18px;
        color: #ffffff;
      }

      h2 {
        font-size: 20px;
        font-weight: 400;
        color: #ffffff;
        margin: 10px 0;

        small {
          font-size: 16px;
          margin-left: 20px;
        }
      }

      .text_flex {
        color: #aaaaaa;

        p {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          line-height: 26px;
        }
      }
    }

    .line-box {
      position: absolute;
      width: 100%;
      height: 70px;
      bottom: 0;
      left: 0;

      .v_chart {
        width: 100%;
        height: 70px;
      }
    }
  }

  .active {
    background: #363766;
  }
</style>
