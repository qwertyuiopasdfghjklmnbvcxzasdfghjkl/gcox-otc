<template>
  <div class="header-container">
    <div class="header-bg"></div>
    <div class="w1200 header-top">
      <p>
        <switch-vi/>
        余额 USDT：0.00
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
        <router-link :to="{name:'home'}" class="item" :activeClass="'active'">{{$t('gcox_otc.P2P_swop')}}</router-link>

        <router-link to="" class="item">
          <span style="color: #fff;">{{$t('gcox_otc.control_panel')}}</span>
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
              <router-link :to="{name:'control_kyc'}" class="sub-item" tag="div">
                <i class="kyc"></i>
                <span>{{$t('usercontent.user38')}}<!-- KYC认证 --></span>
              </router-link>
            </div>
          </div>
        </router-link>

        <router-link to="" class="item" v-if="isLogin">
          <span style="color: #fff;">{{displayUsername}}</span>
          <div class="popover-nav" :class="{en:getLang==='en'}" ref="nav1" @click="hidePopoverNav('nav1')">
            <div class="popover-menu">
              <router-link :to="{name:'mycenter_menu', params:{menu:'mycenter'}}" class="sub-item" tag="div">
                <i class="security"></i>
                <span>{{$t('usercontent.user37')}}<!-- 个人信息中心 --></span>
              </router-link>
              <router-link :to="{name:'mycenter_menu', params:{menu:'authentication'}}" class="sub-item" tag="div">
                <i class="verification"></i>
                <span>{{$t('usercontent.user38')}}<!-- KYC认证 --></span>
              </router-link>
              <router-link :to="{name:'mycenter_menu', params:{menu:'message'}}" class="sub-item" tag="div">
                <i class="message"></i>
                <span>{{$t('usercontent.user41')}}<!-- 系统消息 --></span>
              </router-link>
              <div class="sub-item" @click="logout">
                <i class="logout"></i>
                <span>{{$t('public.navigation_logout')}}<!-- 退出 --></span>
              </div>
            </div>
          </div>
        </router-link>
        <a v-show="!isLogin" class="item pointer" @click="showQuickLogin">{{$t('login_register.login')}}
          <!-- 登录 --></a>
        <router-link v-show="!isLogin" :to="{name:'register'}" class="item f-c-blue">{{$t('login_register.register')}}
          <!-- 注册 --></router-link>
        <a class="item" href="javascript:;" @click="setLanguage('en')" v-if="getLang==='zh-CN'">ENGLISH</a>
        <a class="item" href="javascript:;" @click="setLanguage('zh-CN')" v-if="getLang==='en'">简体中文</a>
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

  export default {
    components: {switchVi},
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['isLogin', 'getUserInfo', 'getLang']),
      displayUsername () {
        if (this.getUserInfo.username) {
          let temp = this.getUserInfo.username.split('@')
          return temp[0].slice(0, Math.ceil(temp[0].length / 2)) + '*'.repeat(Math.floor(temp[0].length / 2)) + '@' + temp[1]
        } else {
          return ''
        }
      }
    },
    watch: {},
    created () {

    },
    beforeDestroy () {

    },
    methods: {
      ...mapActions(['setLang', 'setApiToken']),
      showQuickLogin () {
        utils.setDialog(quickLogin, {
          backClose: true
        })
      },
      setLanguage (lang) {
        this.setLang(lang)
        if (!utils.isPlainEmpty(this.$i18n.getLocaleMessage(lang))) {
          this.$i18n.locale = lang
          return
        }
        //console.log('change langugae')
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
            .kyc {
              background-image: url('../assets/img/icon_otc04.png');
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
              background-image: url('../assets/img/icon-logout.svg');
            }
          }
        }
      }
    }

    .item:hover .popover-nav {
      display: block;
    }

    .item + .item {
      margin-left: 30px;
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

</style>
