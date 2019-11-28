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
        <span class="item1">{{item.appealManageId}}</span>
        <span class="item2">{{item.orderNumber}}</span>
        <span class="item3">{{(item.typeName)}}</span>
        <span class="item4">{{item.description}}</span>
        <span class="item5">{{item.state}}</span>
        <span class="item6">{{item.punishType}}</span>
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
  import otc from '../../api/otc'

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
        let data = {
          page: this.params.page,
          pageSize: this.params.show
        }
        this.loading = true
        otc.appeals(data, (res, total) => {
          this.data = res
          this.params.total = total
          this.loading = false
        }, msg => {
          console.log(msg)
          this.loading = false
        })
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
      padding: 10px 0;

      span {
        padding: 8px;
      }

      .item1 {
        width: 14%;
      }

      .item2 {
        width: 15%;
      }

      .item3 {
        width: 10%;
      }

      .item4 {
        width: 30%;
        word-break: break-word;
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
