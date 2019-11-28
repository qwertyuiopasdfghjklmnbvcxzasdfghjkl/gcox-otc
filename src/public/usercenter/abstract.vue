<template>
  <div>
    <div class="top">
      <p class="w1200">{{$t('home.intro')}}<!-- 简介 --></p>
    </div>
    <div class="cont w1200">
      <div class="tab">
        <div class="cloum">
          <!--<p class="title">{{getUserInfo.username}}{{$t('home.intro')}}&lt;!&ndash; 简介 &ndash;&gt;</p>-->
          <p><span>{{$t('home.home08')}}</span><span>{{getUserInfo.email}}</span></p>
          <p><span>{{$t('otc_exchange.otc_exchange_username')}}</span><span>{{getUserInfo.username}}</span></p>
          <p><span>{{$t('vote_mining.nick_name')}}</span>
            <span>
                <i>{{getUserInfo.nickname || '--'}}</i>
                <small v-if="!getUserInfo.nickname" @click="updateNike()">{{$t('public0.public40')}}</small>
              </span>
          </p>

          <p><span>{{$t('gcox_otc.does')}}</span><span>--</span></p>
          <p><span>{{$t('gcox_otc.success_deal')}}</span><span>{{score}}</span></p>
          <p><span>{{$t('otc_exchange.otc_exchange_Good_rating')}}</span><span>{{level}}%</span></p>
          <!---->
          <!--<p><span>{{$t('gcox_otc.kyc_idcard')}}</span><span>&#45;&#45;</span></p>-->
          <!--<p><span>{{$t('gcox_otc.peer_authentication')}}</span><span>&#45;&#45;</span></p>-->
          <p><span>{{$t('business.MOBILE')}}</span>
            <span>
                <i>{{this.getUserInfo.mobileAuthEnable === 1?getUserInfo.countryCode+ ' '+ getUserInfo.mobile : $t('gcox_otc.no_submit')}}
                </i>
                <small @click="bind()" class="blue">{{this.getUserInfo.mobileAuthEnable === 1?
                $t('gcox_otc.update_phone'):$t('gcox_otc.add_phone')}}</small>
              </span>
          </p>
          <!--<p class="tow_button">-->
          <!--<button>{{$t('gcox_otc.new_buyer')}}</button>-->
          <!--<button>{{$t('gcox_otc.arrears_goods')}}</button>-->
          <!--</p>-->
          <!--<p class="one_button">-->
          <!--<button>{{$t('gcox_otc.block_account')}}</button>-->
          <!--</p>-->
        </div>

      </div>
      <!--<div class="list">-->
      <!--<div class="list_box">-->
      <!--<h4><img src="../../assets/img/flag.png"/>{{$t('gcox_otc.buy_form').format('BTC')}}{{getUserInfo.username}}-->
      <!--</h4>-->
      <!--<div></div>-->
      <!--<p>{{$t('gcox_otc.not_advertising')}}</p>-->
      <!--</div>-->
      <!--<div class="list_box">-->
      <!--<h4><img src="../../assets/img/flag.png"/>{{$t('gcox_otc.sell_to').format('BTC')}}{{getUserInfo.username}}-->
      <!--</h4>-->
      <!--<div></div>-->
      <!--<p>{{$t('gcox_otc.not_advertising')}}</p>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div class="right">-->
      <!--<h4>{{$t('gcox_otc.back_communications').format(getUserInfo.username)}}</h4>-->
      <!--<p>{{$t('gcox_otc.no_communications')}}</p>-->
      <!--</div>-->
      <loading class="load" v-if="load"/>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import utils from '@/assets/js/utils'
  import bind from './abstract/bind-phone'
  import userApi from '@/api/user'
  import otc from '../../api/otc'
  import nikename from './abstract/nikeName'

  export default {
    name: 'abstract',
    data () {
      return {
        level: null,
        score: null,
        load: false
      }
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getLang'])
    },
    created () {
      console.log(this.getUserInfo)
      this.getLevel()
      this.getScoreInfo()
    },
    methods: {
      ...mapActions(['setUserInfo']),
      bind () {
        utils.setDialog(bind, {
          phone: this.getUserInfo.mobile,
          okCallback: () => {
            this.getInfo()
          }
        })
      },
      getInfo () {
        this.load = true
        userApi.getUserInfo((userInfo) => {
          this.setUserInfo(userInfo)
          this.load = false
        }, (res) => {
          console.warn(res)
          this.load = false
        })
      },
      getLevel () {
        otc.getUserLevel(res => {
          this.level = res.toFixed(1)
        })
      },
      getScoreInfo () {
        otc.getScoreInfo(res => {
          console.log(res)
          this.score = res
        })
      },
      updateNike () {
        utils.setDialog(nikename, {
          okCallback: () => {
            this.getInfo()
          }
        })
      }
    }

  }
</script>

<style scoped lang="less">
  .top {
    background: #13143A;
    height: 30px;
    padding: 40px 0;

    p {
      font-size: 24px;
      color: #ffffff;
    }
  }

  .cont {
    margin: 30px auto;

    .tab {
      background: #eeeeee;
      overflow: auto;

      .cloum {
        box-shadow: 0 0 6px #dbdbdb;
        margin: 20px;

        p {
          background: #ffffff;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          font-size: 18px;

          span:first-child {
            width: 200px;
            font-size: 16px;
          }

          span {
            i {
              display: block;
            }

            small {
              color: #00a0e9;
              cursor: pointer;
            }
          }
        }

        p:nth-child(2n) {
          background: #f6f6f6;
        }
      }
    }
  }

  .load {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -25px;
  }
</style>
