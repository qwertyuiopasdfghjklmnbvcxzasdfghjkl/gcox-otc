<template>
  <div class="cont">
    <div class="top w1200">
      <h4><img src="../../assets/img/flag.png">
        <span v-html="$t('gcox_otc.you_want').format('green',$t('gcox_otc.buy'),params.name)"></span>
      </h4>
      <list-box :datas="buyDatas" :type="'buy'" @submit="sell">
        <li>
          <button class="green_button" @click="createorder(2)">{{$t('gcox_otc.build').format($t('gcox_otc.buy'))}}
          </button>
        </li>
      </list-box>
    </div>
    <div class="top bottom w1200">
      <h4><img src="../../assets/img/flag.png">
        <span v-html="$t('gcox_otc.you_want').format('red',$t('gcox_otc.sell'),params.name)"></span>
      </h4>
      <list-box :datas="sellDatas" :type="'sell'" @submit="sell">
        <li class="colem">
          <p>{{$t('gcox_otc.better_price')}}</p>
          <button class="red_button" @click="createorder(1)">{{$t('gcox_otc.build').format($t('gcox_otc.sell'))}}
          </button>
        </li>
      </list-box>
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

  export default {
    name: 'list-index',
    components: {ListBox},
    props: ['params'],
    data () {
      return {
        buyDatas: [],
        sellDatas: [],
        avatarUrl: avatar,
        createParams: this.params
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getUserInfo', 'getLang']),
    },
    watch: {
      params () {
        console.log(this.params)
        this.getBuyList()
        this.getSellList()
        this.createParams = this.params
      }
    },
    created () {
      this.getBuyList()
      this.getSellList()
    },
    methods: {
      getList (i, succes) { // 获取广告列表
        this.loading = true
        otcApi.getAdvertisementList({
          ad_type: i,
          symbol: this.params.symbol,
          currency: 'CNY',
        }, (res) => {
          res.data.forEach((item) => { // 广告列表数据格式化处理
            item.cur_price = item.cur_price ? utils.removeEndZero(parseFloat(item.cur_price).toFixed(2)) : 0
            item.min_amount = utils.removeEndZero(parseFloat(item.min_amount).toFixed(2))
            item.max_amount = utils.removeEndZero(parseFloat(item.max_amount).toFixed(2))
            item.remain_count = utils.removeEndZero(numUtils.BN(item.remain_count).toFixed(8))
          })
          this.loading = false
          succes && succes(res.data)
        }, (msg) => {
          this.loading = false
          console.error(msg)
        })
      },

      getBuyList () { // 获取广告列表
        this.getList(2, (res) => {
          this.buyDatas = res
        })
      },
      getSellList () {
        this.getList(1, (res) => {
          this.sellDatas = res
        })
      },

      createorder (i) {
        this.createParams.ad_type = i
        this.checkSetState((myPayType) => {
          this.$router.push({name: 'advertising', params: {myPayType: myPayType, params: this.createParams,}})
        }, 'public0.public109', true, false)
      },
      sell (data) {
        let isCheckPaySet = parseInt(data.ad_type) === 1
        this.matchPayType = parseInt(data.ad_type) === 1 ? void 0 : data.pay_type

        this.checkSetState(() => {
          if (this.getUserInfo.username === data.username) {
            return
          }
          console.log(data)
          this.$router.push({
            name: 'transaction',
            query: {ad_id: data.ad_id, params: data, matchPayType: this.matchPayType}
          })
          // utils.setDialog(buy, {
          //   id: 'create_order_dialog',
          //   params: this.params,
          //   ad_id: data.ad_id,
          //   matchPayType: this.matchPayType,
          //   okCallback: (id) => {
          //     this.getList()
          //     this.$emit('createNewOrder', id)
          //   },
          //   errCallback: () => {
          //   }
          // })
        }, 'public0.public15', isCheckPaySet, true, data.ad_id)
      },

      checkSetState (successCallback, message, isCheckPaySet, isCheckPayType, id) {
        if (!this.getApiToken) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(message)}) // 请登录后再发布广告||请登录后再交易
          return
        }
        otcApi.getVerifyState((msg) => {
          if (isCheckPaySet) {
            otcApi.getPaySettings((res) => {
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
                        this.$emit('goToSettings')
                        this.$emit('removeDialog')
                      }
                    })
                  } else {
                    Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg3}`)})
                  }
                })
              } else {
                // if (this.isShop) {
                successCallback && successCallback(res.data.pay_type)
                // } else {
                //   let lang = this.getLang === 'zh-CN' ? '非商家无法发布广告，是否立即申请？' : (this.getLang === 'cht' ? '非商戶無法發布廣告，是否立即申請？' : 'Non-merchase can\'t post ads, do you apply now?')
                //   Vue.$confirmDialog({
                //     id: 'goShopsApply',
                //     content: lang,
                //     okCallback: () => {
                //       this.$router.push({path: '/mycenter/agencyApply'})
                //     }
                //   })
                // }
              }
            }, (res) => {
              if (res.msg === 'NO_PAY_TYPE') {
                Vue.$confirmDialog({
                  id: 'NO_PAY_TYPE',
                  content: this.$t('error_code.SET_PAY_TYPE_FIRST'), // 请先设置支付方式
                  okCallback: () => {
                    this.$emit('goToSettings')
                    this.$emit('removeDialog')
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
                this.$emit('goToMyCenter')
                this.$emit('removeDialog')
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
