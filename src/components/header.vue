<template>
  <div class="header-container">
    <div class="header-bg"></div>
    <div class="w1200 header-top">
      <p>
        <switch-vi @change="change" :value="showBalance"/>
        {{$t('gcox_otc.total')}} {{symbolInfo.symbol || 'BTC'}}：
        {{showBalance ? symbolInfo.totalBalance || 0.0 : '--'}}
      </p>
    </div>
    <div class="header w1200 ui-flex ui-flex-justify">
      <div class="">
        <router-link :to="{name:'home'}" class="icon_logo item"></router-link>
        <!--<router-link :to="{name:'market'}" class="item"><i class="market"></i> {{$t('home.home_pair')}}&lt;!&ndash; 市场 &ndash;&gt;-->
        <!--</router-link>-->
        <!--<router-link :to="{name:'exchange_index2'}" class="item" :class="{active:$route.name === 'exchange_index2' || $route.name === 'exchange_index' || $route.name === 'quickTrade'}">-->
        <!--<i class="exchange"></i> {{$t('exchange.exchange_name')}}&lt;!&ndash; 交易所 &ndash;&gt;-->
        <!--<div class="popover-nav black" ref="nav2" @click="hidePopoverNav('nav2')">-->
        <!--<div class="popover-menu">-->
        <!--<router-link :to="{name:'quickTrade'}" class="sub-item" tag="div" v-if="false">-->
        <!--<span>{{$t('exchange.oneClickTrade')}}&lt;!&ndash; 一键购买 &ndash;&gt;</span>-->
        <!--</router-link>-->
        <!--<router-link :to="{name:'exchange_index2'}" class="sub-item" tag="div">-->
        <!--<span>{{$t('exchange.advanced')}}&lt;!&ndash; 专业版 &ndash;&gt;</span>-->
        <!--</router-link>-->
        <!--</div>-->
        <!--</div>-->
        <!--</router-link>-->
        <!--<a href="javascript:;" v-if="!isLogin" class="item" @click="showQuickLogin"><i class="acm"></i> OTC</a>-->

        <!--<a href="javascript:;" v-if="!isLogin" class="item" @click="showQuickLogin"><i class="account"></i> {{$t('usercontent.user56')}}&lt;!&ndash; 资产管理 &ndash;&gt;</a>-->
        <!--<router-link v-if="isLogin" :to="{name:'account'}" class="item"><i class="account"></i> {{$t('usercontent.user56')}}&lt;!&ndash; 资产管理 &ndash;&gt;</router-link>-->
        <!--<router-link v-if="isLogin" v-show="false" :to="{name:'fiat'}" class="item"><i class="icon-curry"></i> FIAT&lt;!&ndash; FIAT &ndash;&gt;</router-link>-->
        <!--<router-link v-if="isLogin" :to="{name:'mycenter_menu', params:{menu:'referral'}}" class="item"><i class="icon-users"></i> {{$t('referral.referral_programme')}}&lt;!&ndash; 我的推荐 &ndash;&gt;</router-link>-->
      </div>
      <div class="right ui-flex-1">

        <router-link :to="{name:'msg'}" class="item msg">
          <img src="../assets/img/msg.png" width="40"/>
        </router-link>

        <router-link :to="{name:'home'}" class="item" :activeClass="'active'">{{$t('gcox_otc.P2P_swop')}}</router-link>
        <router-link :to="{name:'invite'}" class="item" :activeClass="'active'" v-if="isLogin">
          {{$t('gcox_otc.invite')}}
        </router-link>

        <router-link to="" class="item" v-if="isLogin">
          <span style="color: #fff;" class="nav-title">
            {{$t('gcox_otc.control_panel')}}<!--控制面板-->
            <img src="../assets/img/icon-otc10.png"/>
          </span>
          <div class="popover-nav" :class="{en:getLang==='en'}" ref="nav2" @click="hidePopoverNav('nav2')">
            <div class="popover-menu">
              <router-link :to="{name:'overall'}" class="sub-item" tag="div">
                <i class="overall"></i>
                <span>{{$t('gcox_otc.overall')}}<!-- 总体 --></span>
              </router-link>
              <router-link :to="{name:'control_deal'}" class="sub-item" tag="div">
                <i class="deal"></i>
                <span>{{$t('gcox_otc.P2P_deal')}}<!-- P2P交易 --></span>
              </router-link>
              <router-link :to="{name:'control_wallet'}" class="sub-item" tag="div">
                <i class="wallet"></i>
                <span>{{$t('exchange.exchange_wallet')}}<!-- 钱包 --></span>
              </router-link>
              <router-link :to="{name:'control_pay'}" class="sub-item" tag="div">
                <i class="pay icon-bank"></i>
                <span>{{$t('gcox_otc.pay_way')}}<!-- 付款方式 --></span>
              </router-link>
              <router-link :to="{name:'control_kyc'}" class="sub-item" tag="div">
                <i class="kyc"></i>
                <span>{{$t('usercontent.user38')}}<!-- KYC认证 --></span>
              </router-link>
            </div>
          </div>
        </router-link>

        <router-link to="" class="item" v-if="isLogin">
          <span style="color: #fff;" class="nav-title">{{displayUsername}}<img v-if="displayUsername"
                                                                               src="../assets/img/icon-otc10.png"/></span>
          <div class="popover-nav" :class="{en:getLang==='en'}" ref="nav1" @click="hidePopoverNav('nav1')">
            <div class="popover-menu">
              <router-link :to="{name:'usercenter_abstract'}" class="sub-item" tag="div">
                <i class="abstract"></i>
                <span>{{$t('home.intro')}}<!-- 简介 --></span>
              </router-link>
              <router-link :to="{name:'usercenter_set'}" class="sub-item" tag="div">
                <i class="set"></i>
                <span>{{$t('user.set')}}<!-- 设置 --></span>
              </router-link>
              <div class="sub-item" @click="logout">
                <i class="logout"></i>
                <span>{{$t('public.navigation_logout')}}<!-- 退出 --></span>
              </div>
            </div>
          </div>
        </router-link>
        <router-link v-show="!isLogin" class="item pointer" :to="{name:'login'}">{{$t('login_register.login')}}
          <!-- 登录 --></router-link>
        <router-link v-show="!isLogin" :to="{name:'register'}" class="item f-c-blue">{{$t('login_register.register')}}
          <!-- 注册 --></router-link>

        <router-link to="" class="item" v-if="isLogin">
          <span style="color: #fff;" class="nav-title"><small class="country-icon currency_flag"
                                                              :class="'country-'+currency"></small>
            {{currency}}<img src="../assets/img/icon-otc10.png"/></span>
          <div class="popover-nav" :class="{en:getLang==='en'}" ref="nav2" @click="hidePopoverNav('nav2')">
            <div class="popover-menu currency">
              <span v-for="data in curList" @click="currencyFun(data.currency)">
                <small class="country-icon currency_flag" :class="'country-'+data.currency"></small>
                {{data.currency}}</span>
            </div>
          </div>
        </router-link>

        <router-link to="" class="item" v-if="isLogin">
          <span style="color: #fff;" class="nav-title">
            {{lang}}<img src="../assets/img/icon-otc10.png"/>
          </span>
          <div class="popover-nav" :class="{en:getLang==='en'}" ref="nav2" @click="hidePopoverNav('nav2')">
            <div class="popover-menu">
              <p class="lang" @click="setLanguage('en')">ENGLISH</p>
              <p class="lang" @click="setLanguage('zh-CN')">简体中文</p>
            </div>
          </div>
        </router-link>


      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import langApi from '@/api/language'
  import utils from '@/assets/js/utils'
  import quickLogin from '@/components/quickLogin'
  import switchVi from './switch-vi'
  import userUtils from '@/api/wallet'
  import otcApi from '@/api/otc'

  export default {
    components: {switchVi},
    data () {
      return {
        allSymbol: [],
        showBalance: true,
        curList: [],
      }
    },
    computed: {
      ...mapGetters(['isLogin', 'getUserInfo', 'getLang', 'getSymbol', 'getCurrency']),
      displayUsername () {
        if (this.getUserInfo.username) {
          let temp = this.getUserInfo.username.split('@')
          return temp[0].slice(0, Math.ceil(temp[0].length / 2)) + '*'.repeat(Math.floor(temp[0].length / 2)) + '@' + temp[1]
        } else {
          return ''
        }
      },
      symbolInfo () {
        let data = {}
        if (this.allSymbol) {
          this.allSymbol.filter(res => {
            if (res.caption === this.getSymbol.caption) {
              data = res
            }
          })
          return data
        } else {
          this.getBalance()
        }
      },
      currency () {
        return this.getCurrency
      },
      lang () {
        switch (this.getLang) {
          case 'en':
            return 'ENGLISH'
          case 'zh-CN':
            return '简体中文'
        }
      }
    },
    watch: {},
    created () {
      this.getBalance()
      this.getCurList()
    },
    beforeDestroy () {

    },
    methods: {
      ...mapActions(['setLang', 'setApiToken', 'setCurrency']),
      showQuickLogin () {
        utils.setDialog(quickLogin, {
          backClose: true
        })
      },
      currencyFun (id) {
        this.setCurrency(id)
      },
      getBalance () {
        if (this.isLogin) {
          userUtils.myAssets({}, res => {
            this.allSymbol = res
          })
        }
      },
      getCurList () {
        otcApi.getCurrencys(res => {
          this.curList = res
        })
      },
      setLanguage (lang) {
        this.setLang(lang)
        if (!utils.isPlainEmpty(this.$i18n.getLocaleMessage(lang))) {
          this.$i18n.locale = lang
          return
        }
        langApi.getLanguage(lang, (res) => {
          this.$i18n.locale = lang
          this.$i18n.setLocaleMessage(lang, res)
        })
      },
      logout () {
        this.setApiToken(null)
      },
      hidePopoverNav (target) {
        if (this.$refs[target]) {
          this.$refs[target].style.display = 'none'
          setTimeout(() => {
            this.$refs[target].removeAttribute('style')
          }, 1000)
        }
      },
      change (e) {
        this.showBalance = e
      }
    }
  }
</script>

<style lang="less" scoped>
  .header-container {
    height: 100px;

  }

  .header-bg {
    position: fixed;
    z-index: 1000;
    left: 0;
    right: 0;
    top: 0;
    height: 100px;
    background-color: #0C0D34;
  }

  .header-top {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    border-bottom: 2px solid #13143A;
    color: #ffffff;

    p {
      display: flex;
      align-items: center;
    }
  }

  .header {
    position: fixed;
    z-index: 1000;
    top: 40px;
    left: 0;
    right: 0;
    height: 60px;
    line-height: 60px;
    font-size: 14px;

    .right {
      display: flex;
      justify-content: flex-end;

      .active {
        color: #F0B936 !important;
        border-bottom: 2px solid #F0B936;
      }
    }

    .item {
      display: inline-block;
      height: 100%;
      vertical-align: middle;
      position: relative;

      & + .item {
        margin-left: 60px;
      }

      .popover-nav {
        position: absolute;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 4px;
        background: #fff;
        min-width: 130px;
        border: 1px solid #ebeef5;
        z-index: 2000;
        color: #606266;
        text-align: justify;
        font-size: 14px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        word-break: break-all;
        display: none;

        &.en {
          min-width: 200px;
        }

        &.black {
          background: #3F3B3B;
          border-radius: 0;
          border: none;
          color: #fff;

          .popover-menu .sub-item:hover {
            background-color: #333030;
            color: #00a0e9;
          }
        }

        .popover-menu {
          line-height: 40px;
          padding: 10px 0;

          .sub-item {
            padding: 0 20px;
            /*border-bottom: 1px solid rgba(21, 23, 32, .08);*/
            cursor: pointer;
            display: flex;
            position: relative;

            &:hover {
              background-color: #E5E5E5;
            }

            i {
              height: 40px;
              width: 30px;
              background: no-repeat 0;
              background-size: 20px 20px;
            }

            span {
              white-space: nowrap;
            }

            .overall {
              background-image: url('../assets/img/icon_otc01.png');
            }

            .deal {
              background-image: url('../assets/img/icon_otc02.png');
            }

            .wallet {
              background-image: url('../assets/img/icon_otc03.png');
            }

            .pay {
              /*background-image: url('../assets/img/icon_otc03.png');*/
              /*content: 'icon-bank';*/
              color: #0C0D34;
              line-height: 40px;
            }

            .kyc {
              background-image: url('../assets/img/icon_otc04.png');
            }

            .abstract {
              background-image: url('../assets/img/icon_otc05.png');
            }

            .set {
              background-image: url('../assets/img/icon_otc06.png');
            }

            .security {
              background-image: url('../assets/img/icon-security.svg');
            }

            .verification {
              background-image: url('../assets/img/icon-verification.svg');
            }

            .message {
              background-image: url('../assets/img/icon-message.svg');
            }

            .logout {
              background-image: url('../assets/img/icon_otc07.png');
            }
          }
        }
      }
    }

    .item:hover .popover-nav {
      display: block;
    }

    .item + .item {
      margin-left: 48px;
    }

    .icon_logo {
      width: 82px;
      background-image: url('../assets/img/logo.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }

    a {
      /*font-family: 'ethnocentric';*/
      color: #fff !important;

      div {
        font-family: PingFangSC-Regular, Microsoft YaHei, sans-serif;
      }

      i {
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        font-size: 20px;

        &.market {
          background-image: url('../assets/img/MARKETS.svg');
        }

        &.exchange {
          background-image: url('../assets/img/EXCHANGE.svg');
        }

        &.acm {
          background-image: url('../assets/img/ACM.svg');
        }

        &.account {
          background-image: url('../assets/img/ACCOUNT.svg');
        }
      }

      &.active, &:hover, &.router-link-exact-active {
        color: #00A0E9;

        i {
          &.market {
            background-image: url('../assets/img/MARKETS-blue.svg');
          }

          &.exchange {
            background-image: url('../assets/img/EXCHANGE-blue.svg');
          }

          &.acm {
            background-image: url('../assets/img/ACM-blue.svg');
          }

          &.account {
            background-image: url('../assets/img/ACCOUNT-blue.svg');
          }
        }
      }
    }
  }

  .nav-title {
    display: flex;
    align-items: center;

    img {
      width: 12px;
      height: 7px;
      margin-left: 4px;
    }
  }

  .msg {
    img {
      vertical-align: middle;
    }
  }

  .currency {
    display: flex;
    flex-wrap: wrap;
    span {
      flex: 1;
      padding: 6px 18px;
      display: inline-flex;
      align-items: center;
      transition: 0.3s;
      white-space: nowrap;
      &:hover{
        background: #eeeeee;
      }

      small {
        zoom: 0.8;
      }
    }
  }

  .currency_flag {
    border-radius: 50%;
    margin-right: 4px;
  }
  .lang{
    padding: 0 20px;
    transition: 0.3s;
    &:hover{
      background: #eeeeee;
    }
  }
</style>
