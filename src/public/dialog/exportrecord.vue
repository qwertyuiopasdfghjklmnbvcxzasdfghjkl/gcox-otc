<template>
  <div class="export-record">
    <div class="export-record-title">
      <h3>{{$t('trade_record.export_title')}}<!--导出历史记录--></h3>
      <i class="icon-close" @click="closeExport"></i>
    </div>
    <div class="export-record-cont">
      <label class="label">{{$t('trade_record.export_range')}}：<!--时间范围--></label>
      <ul class="list">
        <li class="item" v-for="item in timeRangeList">
          <label :for="item.id">
            <input type="radio" name="timeRange" :value="item.id" v-model="selectval" :id="item.id">
            <em>{{$t(item.text)}}</em>
          </label>
        </li>
      </ul>
      <div class="button">
        <button @click="fnExport">{{$t('trade_record.export_onexport')}}<!--导出--></button>
      </div>
    </div>
  </div>
</template>

<script>
  import otcApi from '@/api/otc'
  import market from '@/api/market'
  import config from '@/assets/js/config'
  import utils from '@/assets/js/utils'

  export default {
    props: {
      exportMarket: {
        type: String,
        default: 'exchange'
      },
      conisetype: {
        type: Number,
        default: 0
      },
      lang: {
        type: String,
        default: 'cn'
      }
    },
    data () {
      return {
        selectval: 'week',
        exportOTCParams: {
          startDate: null,
          endDate: null,
          lang: this.lang
        },
        timeRangeList: [
          {id: 'week', text: 'trade_record.export_1w', name: '最近一周', checked: false},
          {id: 'month', text: 'trade_record.export_1m', name: '最近一个月', checked: false},
          {id: '3months', text: 'trade_record.export_3m', name: '最近三个月', checked: false},
          {id: '6months', text: 'trade_record.export_6m', name: '最近半年', checked: false},
          {id: 'year', text: 'trade_record.export_1y', name: '最近一年', checked: false},
          {id: 'all', text: 'trade_record.export_all', name: '所有记录', checked: false}
        ]
      }
    },
    methods: {
      fnExport () {
        if (this.exportMarket === 'exchange') {
          this.exportExchange()
        } else if (this.exportMarket === 'OTC') {
          this.exportOTC(this.selectval)
        } else {
          console.error('请设置导出报表的市场类型')
        }
      },
      exportExchange () {
        market.exportHistory({
          selectval: this.selectval,
          tp: this.conisetype,
          lang: this.lang
        }, (url) => {
          window.location.href = `${url}&duration=${this.selectval}&tp=${this.conisetype}&lang=${this.lang}`
          this.$emit('removeDialog')
        }, (msg) => {
          console.error(msg)
        })
      },
      exportOTC (checkedTimeRange) {
        let isGetCheckedTimeRange = true
        let unit = 'day'
        let quantity = 6
        switch (checkedTimeRange) {
          case 'week':
            unit = 'day'
            quantity = 6
            break
          case 'month':
            unit = 'month'
            quantity = 1
            break
          case '3months':
            unit = 'month'
            quantity = 3
            break
          case '6months':
            unit = 'month'
            quantity = 6
            break
          case 'year':
            unit = 'year'
            quantity = 1
            break
          case 'all':
            isGetCheckedTimeRange = false
            this.exportOTCParams.startDate = null
            this.exportOTCParams.endDate = null
            break
          default:
            console.error('请选择时间范围')
            break
        }
        if (isGetCheckedTimeRange) {
          utils.getCheckedTimeRange(unit, quantity, (data) => {
            this.exportOTCParams.startDate = data.startDate
            this.exportOTCParams.endDate = data.endDate
          })
        }
        otcApi.exportOTCTradeRecord(this.exportOTCParams, (url) => {
          window.location.href = `${window.location.protocol}//${config.domain}${url}`
          this.$emit('removeDialog')
        }, (msg) => {
          console.error(msg)
        })
      },
      closeExport () {
        this.$emit('removeDialog')
      }
    }
  }
</script>

<style scoped>
  .export-record {
    width: 370px;
    background-color: #fff;
    overflow: hidden;
  }

  .export-record-title {
    height: 60px;
    line-height: 60px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    background-color: #1f1e24;
    position: relative;
  }

  .export-record-title h3 {
    font-weight: normal;
  }

  .export-record-title i {
    position: absolute;
    text-decoration: none;
    font-size: 14px;
    color: #fff;
    top: calc(50% - 7px);
    right: 15px;
    opacity: 0.8;
    cursor: pointer;
  }

  .export-record-title i:hover {
    opacity: 1;
  }

  .export-record-cont {
    padding: 24px 35px 30px 35px;
  }

  .export-record-cont .label {
    display: block;
    height: 24px;
    line-height: 24px;
    color: #333;
  }

  .export-record-cont .list {
    padding-top: 10px;
    overflow: auto;
  }

  .export-record-cont .list li {
    float: left;
    width: 100px;
    height: 24px;
    margin-top: 10px;
    line-height: 24px;
  }

  .export-record-cont .list label {
    cursor: pointer;
  }

  .export-record-cont .list label input {
    display: none;
  }

  .export-record-cont .list label em {
    font-size: 12px;
    color: #333;
  }

  .export-record-cont .list label em::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 12px;
    vertical-align: -1px;
    border: 1px solid #00B5FF;
  }

  .export-record-cont .list label input:checked + em::before {
    background-color: #00B5FF;
  }

  .export-record-cont .button {
    margin-top: 20px;
  }

  .export-record-cont .button button {
    width: 100%;
    height: 35px;
    font-size: 14px;
    color: #fff;
    background-color: #00B5FF;
    border-radius: 4px;
    cursor: pointer;
  }

  .export-record-cont .button button:hover {
    background-color: #009cdc;
  }
</style>
