<template>
  <div class="echart_box">
    <div class="data_box">
      <h4>BTC {{$t('public0.public158')}}</h4>
      <h2><span class="red">35.12</span> {{getCurrency}}
        <small v-html="percent(item)">-12.12%</small>
      </h2>
      <div class="text_flex">
        <p><span>24H Low</span><span>{{item.lowPrice24h}}</span></p>
        <p><span>24H Hign</span><span>{{item.highPrice24h}}</span></p>
      </div>
    </div>
    <div class="line-box">
      <v-chart class="v_chart" :options="polar"/>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import numUtils from '@/assets/js/numberUtils'

  export default {
    props: ['item', 'kline'],
    data () {
      return {
        polar: {
          animation: false,
          height: 90,
          grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '90px',
            show: false
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            show: false,
            data: [],
          },
          yAxis: {
            show: false
          },
          series: [{
            data: [],
            type: 'line',
            smooth: true,
            itemStyle: {
              opacity: 0
            },
            lineStyle: {
              color: 'rgb(48, 50, 101)',
              width: 3
            },
            areaStyle: {
              color: 'rgb(30, 31, 65)'
            },
          }]
        }
      }
    },
    computed: {
      ...mapGetters(['getLang', 'getSymbol', 'getCurrency', 'getUserInfo', 'getApiToken']),
    },
    watch: {
      kline(e){
        console.log(e)
        this.polar.series[0].data = e.sData
        this.polar.xAxis.data = e.xData
      }
    },
    created () {

    },
    methods: {
      percent (item) {
        if (numUtils.BN(item.openingPrice).equals(0)) {
          return '0.00%'
        } else if (item.openingPrice && item.lastPrice) {
          var percent = numUtils.mul(numUtils.BN(item.change24h).div(item.openingPrice), 100)
          return `<font class="${percent < 0 ? 'rang-down' : 'rang-up'}">` + percent.toFixed(2) + '%</font>'
        } else {
          return '0.00%'
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .echart_box {
    position: absolute;
    width: 100%;
    height: 210px;

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
        color: #ffffff;

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
      height: 90px;
      bottom: 0;
      left: 0;

      .v_chart {
        width: 100%;
        height: 90px;
      }
    }
  }
</style>
