<template>
  <div class="cont">
    <div class="top w1200">
      <h4><img src="src/assets/img/flag.png">
        <span v-html="$t('gcox_otc.you_want').format('green',$t('gcox_otc.buy'),params.name)"></span>
      </h4>
      <list-box :datas="buyDatas" :type="'buy'">
        <li>
          <button class="green_button">{{$t('gcox_otc.build').format($t('gcox_otc.buy'))}}</button>
        </li>
      </list-box>
    </div>
    <div class="top bottom w1200">
      <h4><img src="src/assets/img/flag.png">
        <span v-html="$t('gcox_otc.you_want').format('red',$t('gcox_otc.sell'),params.name)"></span>
      </h4>
      <list-box :datas="sellDatas" :type="'sell'">
        <li class="colem">
          <p>{{$t('gcox_otc.better_price')}}</p>
          <button class="red_button">{{$t('gcox_otc.build').format($t('gcox_otc.sell'))}}</button>
        </li>
      </list-box>
    </div>
  </div>
</template>

<script>
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'
  import numUtils from '@/assets/js/numberUtils'
  import avatar from '@/assets/images/touxiang.png'
  import ListBox from '../../components/list-box'

  export default {
    name: 'list-index',
    components: {ListBox},
    props: ['params'],
    data () {
      return {
        buyDatas: [],
        sellDatas: [],
        avatarUrl: avatar,
      }
    },
    computed: {

    },
    watch: {
      params () {
        console.log(this.params)
        this.getBuyList()
        this.getSellList()
      }
    },
    created () {
      this.getBuyList()
      this.getSellList()
    },
    methods: {
      getBuyList () { // 获取广告列表
        this.buyDatas = []
        this.loading = true
        otcApi.getAdvertisementList({
          ad_type: 2,
          symbol: this.params.symbol,
          currency: 'CNY',
        }, (res) => {
          res.data.forEach((item) => { // 广告列表数据格式化处理
            item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
            item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
          })
          this.buyDatas = res.data
          this.loading = false
        }, (msg) => {
          this.loading = false
          console.error(msg)
        })
      },
      getSellList () {
        this.sellDatas = []
        this.loading = true
        otcApi.getAdvertisementList({
          ad_type: 1,
          symbol: this.params.symbol,
          currency: 'CNY',
        }, (res) => {
          res.data.forEach((item) => { // 广告列表数据格式化处理
            item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0

            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))

            item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
          })
          this.sellDatas = res.data
          this.loading = false
        }, (msg) => {
          this.loading = false
          console.error(msg)
        })
      }
    }

  }
</script>

<style scoped lang="less">
  .cont {
    background: #ffffff;
    overflow: auto;

    .top {
      margin: 45px auto;
      color: #333333;

      h4 {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin: 20px 0;

        img {
          margin-right: 8px;
        }
      }

      li {
        &.colem{
          display: flex;
          flex-flow: column;
          justify-content: flex-start;
          align-items: flex-start;
          p{
            padding: 10px 0;
          }
        }
      }
    }


    .bottom {
      /*margin-top: 45px;*/
    }
  }
</style>
