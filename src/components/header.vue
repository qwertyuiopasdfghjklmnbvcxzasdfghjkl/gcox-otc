<template>
  <div class="header-container">
    <div class="header-bg"></div>
    <div class="w1200 header-top" v-if="false">
      <p>
        <switch-vi v-model="showBalance"/>
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

        <div class="flex_left">
          <router-link :to="{name:'home'}" class="item" :activeClass="'active'">{{$t('gcox_otc.P2P_swop')}}
          </router-link>
          <a :href="url" target="_blank">{{$t('otc_public.otc_navigation_support')}} <!-- 帮助中心--></a>
          <router-link :to="{name:'invite'}" class="item" :activeClass="'active'" v-if="isLogin">
            {{$t('gcox_otc.invite')}}
          </router-link>
        </div>

        <router-link :to="{name:'msg'}" @click="newMsg = false" class="item msg">
          <img src="../assets/img/msg.png" width="40"/>
          <i class="new_msg" v-if="newMsg"></i>
        </router-link>

        <router-link to="" class="item" v-if="isLogin">
          <span style="color: #fff;" class="nav-title">
            {{$t('gcox_otc.control_panel')}}<!--控制面板-->
            <img src="../assets/img/icon-otc10.png"/>
          </span>
          <div class="popover-nav" :class="{en:getLang==='en'}" ref="nav2" @click="hidePopoverNav('nav2')">
            <div class="popover-menu">
              <!--<router-link :to="{name:'overall'}" class="sub-item" tag="div">-->
              <!--<i class="create"></i>-->
              <!--<span>{{$t('gcox_otc.overall')}}&lt;!&ndash;  总体&ndash;&gt;</span>-->
              <!--</router-link>-->
              <a href="javascript:;" @click="createAd()" class="sub-item" tag="div">
                <i class="create"></i>
                <span class="f-c-gray">{{$t('otc_ad.otc_post_ad')}}<!--  创建广告--></span>
              </a>
              <router-link :to="{name:'control_deal'}" class="sub-item" tag="div">
                <i class="deal"></i>
                <span>{{$t('gcox_otc.P2P_deal')}}<!-- P2P交易 --></span>
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

        <router-link to="" class="item">
          <span style="color: #fff;" class="nav-title"><small class="country-icon currency_flag"
                                                              :class="'country-'+getCurrency"></small>
            {{getCurrency}}<img src="../assets/img/icon-otc10.png"/></span>
          <div class="popover-nav cur" ref="nav3"
               @click="hidePopoverNav('nav3')">
            <div class="popover-menu currency">
              <span v-for="data in curList" @click="currencyFun(data.currency)">
                <small class="country-icon currency_flag" :class="'country-'+data.currency"></small>
                {{data.currency}}</span>
            </div>
          </div>
        </router-link>

        <router-link to="" class="item">
          <span style="color: #fff;" class="nav-title">
            {{lang}}<img src="../assets/img/icon-otc10.png"/>
          </span>
          <div class="popover-nav" :class="{en:getLang==='en'}" ref="nav2" @click="hidePopoverNav('nav2')">
            <div class="popover-menu">
              <p class="lang" @click="setLanguage('zh-CN')">简体中文</p>
              <p class="lang" @click="setLanguage('en')">ENGLISH</p>
              <!--<a href="javascript:void($zopim.livechat.setLanguage('en'))">English</a>-->
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
  import Vue from 'vue'

  export default {
    components: {switchVi},
    data () {
      return {
        allSymbol: [],
        showBalance: true,
        curList: [],
        createParams: {},
        location: null,
        newMsg: false
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
      url () {
        let href = null
        switch (this.getLang) {
          case 'zh-CN' :
            href = 'https://gcoxotc.zendesk.com/hc/zh-cn'
            break
          case 'en' :
            href = 'https://gcoxotc.zendesk.com/hc/en-us'
            break
          case 'vi-vn' :
            href = 'https://gcoxotc.zendesk.com/hc/vi-vn'
        }
        return href
      },
      symbolInfo () {
        let data = {}
        let s = this.getSymbol
        if (this.allSymbol) {
          this.allSymbol.filter(res => {
            if (res.caption === this.getSymbol.caption) {
              data = res
            }
          })
          s.totalBalance = data.totalBalance
          this.setSymbol(s)
          return data
        } else {
          this.getBalance()
        }
      },
      // currency () {
      //   let c = null
      //   this.curList.filter(res => {
      //     if (res.currency.indexOf(this.location) !== -1) {
      //       c = res.currency
      //     }
      //   })
      //   if (c) {
      //     this.setCurrency(c)
      //   }
      // },
      // setCurrency () {
      //   let c = null
      //   this.curList.filter(res => {
      //     if (res.currency.indexOf(this.location) !== -1) {
      //       c = res.currency
      //     }
      //   })
      //   return c
      // },
      lang () {
        switch (this.getLang) {
          case 'en':
            return 'ENGLISH'
          case 'zh-CN':
            return '简体中文'
        }
      }
    },
    watch: {
      location () {
        if (this.curList) {
          this.setC()
        }
      },
      curList () {
        if (this.location) {
          this.setC()
        }
      }
    },
    created () {
      this.getBalance()
      this.getCurList()
      this.getLocation()
      this.addOtcSocketEvent(this.systemEvent)
    },
    mounted () {
      zE('webWidget', 'setLocale', this.getLang);
    },
    beforeDestroy () {

    },
    methods: {
      ...mapActions(['addOtcSocketEvent', 'setLang', 'setApiToken', 'setCurrency', 'setSymbol']),
      systemEvent (data) {
        let optType = parseInt(data.operate_type)
        if (optType === 1) {
          this.newMsg = true
        }
        console.log(data)
      },
      setC () {
        let c = null
        this.curList.filter(res => {
          if (res.currency.indexOf(this.location) !== -1) {
            c = res.currency
          }
        })
        if (c) {
          this.setCurrency(c)
        }
      },
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
          window.localStorage.currencyList = res
        })
      },
      getLocation () {
        otcApi.location(res => {
          this.location = res
          console.log(res)
        })
      },
      setLanguage (lang) {
        this.setLiveChat(lang)

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
      setLiveChat (lang) {
        switch (lang) {
          case 'zh-CN' :
            $zopim.livechat.setLanguage('zh_CN')
            break
          case 'en' :
            $zopim.livechat.setLanguage('en')
            break
          case 'vi-vn' :
            $zopim.livechat.setLanguage('vi_vn')
        }
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
      // change (e) {
      //   this.showBalance = e
      // }
      createAd () {
        this.createParams.ad_type = 2
        this.createParams.currency = this.getCurrency
        let p = {
          adType: 1,
          role: 'Maker'
        }
        this.checkSetState(p, (myPayType) => {
          this.$router.push({name: 'advertising', params: {myPayType: myPayType, params: this.createParams,}})
        }, 'public0.public109', true, false)
      },
      checkSetState (p, successCallback, message, isCheckPaySet, isCheckPayType, id) {
        if (!this.isLogin) {
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

<style lang="less" scoped>
  .header-container {
    height: 60px;

  }

  .header-bg {
    position: fixed;
    z-index: 1000;
    left: 0;
    right: 0;
    top: 0;
    height: 60px;
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
    top: 0;
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

      .cur {
        width: 210px;
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

            .create {
              background-image: url('../assets/img/create.png');
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

    position: relative;

    .new_msg {
      position: absolute;
      top: 22px;
      right: 8px;
      display: block;
      width: 10px;
      height: 10px;
      background: #cc0000;
      border-radius: 50%;
    }
  }

  .currency {
    display: flex;
    flex-wrap: wrap;

    span {
      flex: 1;
      padding: 6px 15px;
      display: inline-flex;
      align-items: center;
      transition: 0.3s;
      white-space: nowrap;

      &:hover {
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

  .lang {
    padding: 0 20px;
    transition: 0.3s;

    &:hover {
      background: #eeeeee;
    }
  }

  .flex_left {
    flex: 1;

    a {
      margin-left: 48px;
    }
  }
</style>
