<template>
  <div class="wrap">
    <!--下拉-->
    <select-index :params="params" @change="change"/>
    <!-- 通知 -->
    <!--<notice/>-->
    <!--推荐市场-->
    <!--<indexrecom ref="indexrecom"/>-->
    <!--数据表格-->
    <!--<indexdatatable/>-->

    <!--列表-->
    <list-index :params="params"/>

    <div class="law">
      <div class="w1200 cont">
        <div>
          <h2>$500M+</h2>
          <p>Digital currency exchanged</p>
        </div>
        <div>
          <h2>30+</h2>
          <p>Countries supported</p>
        </div>
        <div>
          <h2>1.5M+</h2>
          <p>Customers served</p>
        </div>
      </div>
    </div>

    <tipbox/>
    <!--<news/>-->
    <download/>

    <!--<regbox/>-->
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import indexdatatable from '@/public/index/datatable'
  import indexslider from '@/public/index/indexslider'
  import notice from '@/public/index/notice'
  import indexrecom from '@/public/index/indexrecom'
  import tipbox from '@/public/index/tipbox'
  import news from '@/public/index/news'
  import download from '@/public/index/download'
  import regbox from '@/public/index/regbox'
  import SelectIndex from './index/select-index'
  import ListIndex from './index/list-index'

  export default {
    name: 'app',
    components: {
      ListIndex,
      SelectIndex,
      indexdatatable,
      indexslider,
      notice,
      indexrecom,
      tipbox,
      news,
      download,
      regbox
    },
    data () {
      return {
        params: {
          img: 'btc',
          name: 'Bitcoin',
          symbol: 'BTC'
        }
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getLang']),
    },
    watch: {
      getApiToken () {
        this.socket && this.socket.changeLogin()
      }
    },
    created () {
    },
    methods: {
      change(e){
        console.log(e)
        this.params = e
      }
    },
  }
</script>

<style scoped lang="less">
  .law {
    background: #13143A;
    overflow: auto;
    margin-top: 35px;

    .cont {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 100px auto;

      div {
        text-align: center;
        color: #ffffff;

        h2 {
          font-size: 48px;
          font-weight: 400;
          margin-bottom: 20px;
        }

        p {
          font-size: 24px;
        }
      }
    }
  }
</style>

