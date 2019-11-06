<template>
  <div>
    <ul class="list" v-if="!loading && data.length > 0">
      <li class="item title">
        <span class="item1">{{$t('gcox_otc.complaint_id')}}<!--申诉编号--></span>
        <span class="item2">{{$t('otc_exchange.otc_exchange_order_number')}}<!--订单编号--></span>
        <span class="item3">{{$t('gcox_otc.complaint_type')}}<!--申诉类型--></span>
        <span class="item4">{{$t('gcox_otc.complaint_cont')}}<!--申诉内容--></span>
        <span class="item5">{{$t('gcox_otc.complaint_status')}}<!--申诉状态--></span>
        <span class="item6">{{$t('gcox_otc.complaint_results')}}<!--申诉结果--></span>

      </li>
      <li class="item" v-for="item in data" :key="item.order_id">
        <span class="item1">{{item.order_number}}</span>
        <span class="item2">{{(item)}}</span>
        <span class="item3">{{(item.state)}}</span>
        <span class="item4">{{item.symbol}}</span>
        <span class="item5">{{item.cur_price}} {{item.currency}}</span>
        <span class="item6">{{item.symbol_count}} {{item.symbol}}</span>
      </li>
    </ul>
    <page v-if="!loading && data.length > 0" :pageIndex="params.page" :pageSize="params.show"
          :total="params.total" @changePageIndex="pageChange"/>
    <div class="nodata" v-if="!loading && data.length === 0">
      <div class="nodata-icon icon-no-order"></div>
      <div class="nodata-text">{{$t('public0.public141')}}<!--暂无订单--></div>
    </div>
    <loading v-if="loading"/>
  </div>
</template>

<script>
  import Page from '../../components/page'

  export default {
    name: 'complaintList',
    components: {Page},
    data () {
      return {
        loading: false,
        params: {
          page: 1,
          show: 10,
          total: 0
        },
        data: []
      }
    },
    created () {
      this.getList()
    },
    methods: {
      pageChange (e) {
        this.params.page = e
        this.getList()
      },
      getList () {

      }
    }
  }
</script>

<style scoped lang="less">
  .nodata {
    text-align: center;
  }

  .nodata-icon {
    height: 80px;
    line-height: 80px;
    font-size: 40px;
    color: #A1A1A1;
  }

  .nodata-text {
    height: 40px;
    line-height: 20px;
    color: #8b94a9;
  }

  .list {
    padding-left: 20px;
    padding-right: 20px;

    .item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eeeeee;
      height: 40px;

      span {
        padding: 8px;
      }

      .item1 {
        width: 14%;
      }

      .item2 {
        width: 14%;
      }

      .item3 {
        width: 14%;
      }

      .item4 {
        width: 30%;
      }

      .item5 {
        width: 14%;
      }

      .item6 {
        width: 14%;
      }
    }

    .title {
      span {
        color: #666666;
      }
    }
  }
</style>
