<template>
  <div class="cont">
    <div class="top w1200">
      <h4><img src="../../assets/img/flag.png">
        <span v-html="$t('gcox_otc.you_want').format('green',$t('otc_exchange.otc_exchange_buy'),params.name)"></span>
      </h4>
      <list-box :datas="buyDatas" :type="'buy'" @submit="sell"></list-box>

      <page v-if="!loading && buyDatas.length > 0" :pageIndex="form.buyPage" :pageSize="6"
            :total="buyTotal" @changePageIndex="pageChangeBuy"/>
      <ul>
        <li class="colem">
          <p>{{$t('gcox_otc.better_price')}}</p>
          <button class="green_button" @click="createorder(2)">
            {{$t('gcox_otc.build').format($t('otc_exchange.otc_exchange_buy'))}}
          </button>
        </li>
      </ul>
      <loading class="load" v-if="loading"/>
    </div>
    <div class="top bottom w1200">
      <h4><img src="../../assets/img/flag.png">
        <span v-html="$t('gcox_otc.you_want').format('red',$t('otc_exchange.otc_exchange_sell'),params.name)"></span>
      </h4>
      <list-box :datas="sellDatas" :type="'sell'" @submit="sell"></list-box>
      <page v-if="!loading && sellDatas.length > 0" :pageIndex="form.sellPage" :pageSize="6"
            :total="sellTotal" @changePageIndex="pageChangeSell"/>
      <ul>
        <li class="colem">
          <p>{{$t('gcox_otc.better_price')}}</p>
          <button class="red_button" @click="createorder(1)">
            {{$t('gcox_otc.build').format($t('otc_exchange.otc_exchange_sell'))}}
          </button>
        </li>
      </ul>
      <loading class="load" v-if="loading1"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'
  import numUtils from '@/assets/js/numberUtils'
  import avatar from '@/assets/images/touxiang.png'
  import ListBox from '../../components/list-box'
  import createorder from '@/otc/otchome/createorder'
  import Page from '../../components/page'

  export default {
    name: 'list-index',
    components: {Page, ListBox},
    props: ['params'],
    data () {
      return {
        buyDatas: [],
        sellDatas: [],
        avatarUrl: avatar,
        createParams: this.params,
        form: {
          sellPage: 1,
          buyPage: 1
        },
        loading: false,
        loading1: false,
        buyTotal: 0,
        sellTotal: 0,
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getUserInfo', 'getLang', 'getCurrency']),
    },
    watch: {
      params () {
        console.log(this.params)
        this.getBuyList()
        this.getSellList()
        this.createParams = this.params
      },
      getCurrency () {
        this.getBuyList()
        this.getSellList()
      }
    },
    created () {
      this.getBuyList()
      this.getSellList()
    },
    methods: {
      getList (data, succes) { // 获取广告列表
        otcApi.getAdvertisementList({
          ad_type: data.i,
          symbol: this.params.symbol,
          currency: this.getCurrency,
          page: data.page,
          show: 6
        }, (res) => {
          res.data.forEach((item) => { // 广告列表数据格式化处理
            item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
            item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
          })
          succes && succes(res.data, res.total)
        }, (msg) => {
          this.loading = false
          this.loading1 = false
          // console.error(msg)
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },

      getBuyList () { // 获取广告列表
        let data = {
          i: 2,
          page: this.form.buyPage
        }
        this.loading = true
        this.getList(data, (res, total) => {
          this.buyTotal = total
          this.buyDatas = res
          this.buyDatas.sort((item1, item2) => {
            let m1 = numUtils.BN(item1.cur_price)
            let m2 = numUtils.BN(item2.cur_price)
            return m1.lt(m2) ? -1 : 1
          })
          let buyCur = this.buyDatas[0] ? this.buyDatas[0].cur_price : 0
          this.$emit('buyCur', buyCur)
          this.loading = false
        })
      },
      pageChangeBuy (e) {
        this.form.buyPage = e
        this.getBuyList()
      },
      getSellList () {
        let data = {
          i: 1,
          page: this.form.sellPage
        }
        this.loading1 = true
        this.getList(data, (res, total) => {
          this.sellTotal = total
          this.sellDatas = res
          this.sellDatas.sort((item1, item2) => {
            let m1 = numUtils.BN(item1.cur_price)
            let m2 = numUtils.BN(item2.cur_price)
            return m1.lt(m2) ? 1 : -1
          })
          let sellCur = this.sellDatas[0] ? this.sellDatas[0].cur_price : 0
          this.$emit('sellCur', sellCur)
          this.loading1 = false
        })
      },
      pageChangeSell (e) {
        this.form.sellPage = e
        this.getSellList()
      },

      createorder (i) {
        this.createParams.ad_type = i
        let p = {
          adType: i === 1 ? 2 : 1,
          role: 'Maker'
        }
        this.checkSetState(p, (myPayType) => {
          this.$router.push({name: 'advertising', params: {myPayType: myPayType, params: this.createParams,}})
        }, 'public0.public109', true, false)
      },
      sell (data) {
        let isCheckPaySet = parseInt(data.ad_type) === 1
        this.matchPayType = parseInt(data.ad_type) === 1 ? void 0 : data.pay_type
        let p = {
          adType: data.ad_type,
          role: 'Taker'
        }
        this.checkSetState(p, () => {
          if (this.getUserInfo.userId === data.from_user_id) {
            // 不可以买卖自己发布的广告
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`gcox_otc.not_buy_myself`)})
            return
          }
          let query = {ad_id: data.ad_id, params: data, matchPayType: this.matchPayType}
          window.localStorage.ordDet = JSON.stringify(query)
          this.$router.push({
            name: 'transaction',
          })
        }, 'public0.public15', true, true, data.ad_id)
      },

      checkSetState (p, successCallback, message, isCheckPaySet, isCheckPayType, id) {
        if (!this.getApiToken) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(message)}) // 请登录后再发布广告||请登录后再交易
          return
        }
        if (!this.getUserInfo.mobile) {
          Vue.$confirmDialog({
            id: 'bind_mobile',
            content: this.$t('gcox_otc.bind_mobile'), // 请先绑定手机号
            okCallback: () => {
              this.$router.push({name: 'usercenter_abstract'})
            }
          })
          return
        }
        otcApi.permission(p, (msg) => {
          if (isCheckPaySet) {
            otcApi.getPaySettings((res) => {
              console.log(res.data.bankList.length)
              if (res.data.bankList.length === 0) {
                Vue.$confirmDialog({
                  id: 'NO_PAY_TYPE',
                  content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
                  okCallback: () => {
                    this.$router.push({name: 'control_pay'})
                  }
                })
                return
              }
              if (isCheckPayType) {
                otcApi.matchPayTypes(id, (data2) => {
                  this.matchPayType = data2
                  successCallback && successCallback()
                }, (msg3) => {
                  if (msg3 === 'PAY_TYPE_UNMATCH') {
                    Vue.$confirmDialog({
                      id: 'PAY_TYPE_UNMATCH',
                      content: this.$t('error_code.PAY_TYPE_UNMATCH'), // 支付方式不匹配，请设置对应的支付方式
                      okCallback: () => {
                      }
                    })
                  } else {
                    Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg3}`)})
                  }
                })
              } else {
                successCallback && successCallback(res.data.pay_type)
              }
            }, (res) => {
              if (res.msg === 'NO_PAY_TYPE') {
                Vue.$confirmDialog({
                  id: 'NO_PAY_TYPE',
                  content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
                  okCallback: () => {
                    this.$router.push({name: 'control_pay'})
                  }
                })
              } else {
                Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
              }
            })
          } else {
            successCallback && successCallback()
          }
        }, (msg) => {
          if (msg === 'KYC_AUTH_FIRST') {
            Vue.$confirmDialog({
              id: 'KYC_AUTH_FIRST',
              content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
              okCallback: () => {
                this.$router.push({name: 'control_kyc'})
              }
            })
          } else {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          }
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
        background: #FBFBFB;
        border-left: 4px solid #eeeeee;
        padding: 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        margin-bottom: 20px;
        &.colem {
          display: flex;
          flex-flow: column;
          justify-content: flex-start;
          align-items: flex-start;

          p {
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
