<template>
  <div id="app">
    <template v-if="$route.name !== 'login'">
      <!--屏蔽用户名/密码自动填写：创建假的用户名/密码input让chrome浏览器填充，在autocomplete=off不起作用时适用-->
      <input class="fake-input" type="text" name="fakeusernameremembered">
      <input class="fake-input" type="password" name="fakepasswordremembered"/>
    </template>
    <bheader/>
    <div v-if="isIE" class="compatible" v-show="browser">
      <div class="compatible-w">{{$t('public0.public239').format('GCOX')}}
        <!--建议您使用Chrome浏览器获取GCOX最佳体验。如使用360或QQ浏览器，可切换至极速模式。--><span @click="closeCompa">×</span></div>
    </div>
    <div class="minHeight rp">
      <router-view/>
    </div>

    <bottom v-show="!$route.meta.noBottom"/>

    <!--<div class="cat" v-show="showChat">-->
    <!--<em class="close" @click="openChat()"><img width="20" src="./assets/img/close.png"/></em>-->
    <!--<chat ref="chat" v-if="getApiToken"-->
    <!--v-show="showChat" v-model="showChat"-->
    <!--:orderNumber="orderNumber"-->
    <!--:switchNew="switchNew"-->
    <!--:firstEnter="firstEnter" @markNewMsg="markNewMsg"/>-->
    <!--</div>-->
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import utils from '@/assets/js/utils'
  import numUtils from '@/assets/js/numberUtils'
  // import GlobalWebSocket from '@/assets/js/websocket'
  import OtcWebSocket from '@/assets/js/websocket-otc'
  import bheader from '@/components/header'
  import bottom from '@/components/bottom'
  import userApi from '@/api/user'
  import marketApi from '@/api/market'
  import chat from '@/components/chat'
  import msgApi from '@/api/individual'
  import Vue from 'vue'

  export default {
    name: 'app',
    components: {
      bheader,
      bottom,
      chat
    },
    data () {
      return {
        ws: null,
        gws: null,
        browser: true,
        fromRoute: null,
        showChat: false,
        orderNumber: null,
        // newMsg: false,
        firstEnter: 0,
        switchNew: 0,
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getOtcSocketEvents', 'getLang', 'getSymbol', 'getCurrency']),
      isIE () {
        // (true = IE9) || true >= IE10
        return (document.all && document.addEventListener && !window.atob) || (document.body.style.msTouchAction !== undefined)
      },
      params () {
        let data = this.getSymbol
        data.currency = this.getCurrency
        return data
      },
    },
    watch: {
      getLang (_n) {
        utils.gtValidate()
        let tar = document.getElementsByTagName('title')
        if (_n === 'en') {
          tar[0].innerText = 'GCOX - Global Crypto Offering Exchange'
        } else {
          tar[0].innerText = 'GCOX-比特币以太坊专业数字货币交易网站'
        }
      },
      getApiToken (val) {
        if (val) {
          this.getUserInfoMethod()
          this.getBtcPrice()
        }
        try {
          // this.gws.changeLogin()
        } catch (ex) {
          console.warn(ex)
        }
        if (val) {
          // 登录跳转
          if (window.noLoginRedirect) {
            window.noLoginRedirect = false
            return
          }
          let tempName = null
          if (this.fromRoute) {
            if (this.fromRoute.meta.goHome) {
              tempName = 'home'
            } else {
              tempName = (this.fromRoute.name === 'login' || this.$route.name === 'login') ? 'home' : this.fromRoute.name
            }
          } else {
            tempName = 'home'
          }
          this.$router.push({name: tempName})
          try {
            this.ws && this.ws.open()
          } catch (ex) {
            window.console.warn(ex)
          }
        } else {
          this.$route.meta.login ? this.$router.push({name: 'home'}) : void 0
          try {
            this.ws && this.ws.close()
          } catch (ex) {
            window.console.warn(ex)
          }
        }
        this.socket && this.socket.changeLogin()
      },
      'params.newOrderCount' () {
        this.showChat = true
      },
      showChat (val) {
        if (val) {
          this.firstEnter++
        }
      },
      '$route' (to, from) {
        this.fromRoute = from
        this.checkRouteChange(to)
      }
    },
    created () {
      this.getBtcPrice()
      this.getPrice()
      this.getSysparams()
      this.getUserInfoMethod()
      this.checkRouteChange(this.$route)
      this.ws = new OtcWebSocket({
        onMessage: (data) => {
          let events = this.getOtcSocketEvents
          for (let i = 0; i < events.length; i++) {
            let ev = events[i]
            ev(data)
          }
        }
      })
      if (utils.isMobile) {
        var f = Math.min(window.screen.width, window.screen.height)
        document.documentElement.className = 'phone'
        document.documentElement.style.fontSize = f / 7.5 + 'px'
      }
    },
    mounted () {
      setTimeout(() => {
        if (this.getApiToken) {
          this.newMsg()
        }
      }, 3000)
    },
    beforeDestroy () {
      this.ws && this.ws.close()
    },
    methods: {
      ...mapActions(['setBTCValuation', 'setUSDCNY', 'setNetworkSignal', 'setUserInfo', 'setSysParams', 'setSymbol', 'setNewMsg']),
      newMsg () {
        msgApi.getMessages({}, res => {
          if (res.data) {
            this.setNewMsg(true)
          }
        })
      },
      getBtcPrice () {
        if (!this.getApiToken) {
          return
        }
        marketApi.getBtcPrice(res => {
          this.setBTCValuation(numUtils.BN(res.btcAmount).toFixed(8)) // 当前转换人民币
        })
      },
      getPrice () {
        marketApi.getPrice(res => {
          console.log(res)
          this.setUSDCNY({
            CNY: numUtils.BN(res.CNY).toFixed(2),
            HKD: numUtils.BN(res.HKD).toFixed(2),
            IDR: numUtils.BN(res.IDR).toFixed(2),
            KHR: numUtils.BN(res.KHR).toFixed(2),
            MOP: numUtils.BN(res.MOP).toFixed(2),
            MYR: numUtils.BN(res.MYR).toFixed(2),
            PHP: numUtils.BN(res.PHP).toFixed(2),
            SGD: numUtils.BN(res.SGD).toFixed(2),
            THB: numUtils.BN(res.THB).toFixed(2),
            TWD: numUtils.BN(res.TWD).toFixed(2),
            USD: numUtils.BN(res.USD).toFixed(2),
            // USDT: numUtils.BN(res.USDT).toFixed(2),
            VND: numUtils.BN(res.VND).toFixed(2)
          })
        })
      },
      getSysparams () {
        marketApi.rateSysparams(res => {
          let params = {}
          for (let item of res) {
            params[item.code] = item
          }
          this.setSysParams(params)
        })
      },
      checkRouteChange (currentRoute) {
        if (this.getApiToken) {
          currentRoute.meta.noEntry ? this.$router.push({name: 'home'}) : void 0
        } else {
          currentRoute.meta.login ? this.$router.push({name: 'home'}) : void 0
        }
      },
      closeCompa () {
        this.browser = false
      },
      getUserInfoMethod () {
        if (!this.getApiToken) {
          return
        }
        userApi.getUserInfo((userInfo) => {
          if (this.getApiToken) {
            this.setUserInfo(userInfo)
          }
        }, (res) => {
          console.warn(res)
          setTimeout(() => {
            this.getUserInfoMethod()
          }, 1000)
        })
      },
      change (e) {
        console.log(e)
        this.setSymbol(e)
      }
    }
  }
</script>

<style scoped>
  /*君生我未生，我生君已死，扑街*/
  .fake-input {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }

  .mycenter {
    position: fixed;
    z-index: 9999;
    top: 50%;
    width: 24px;
    height: 50px;
    margin-top: -25px;
    background: url(./assets/images/slide.png) no-repeat center center;
  }

  .mycenter.arrow-left {
    right: 0;
  }

  .mycenter.arrow-right {
    left: 0;
    transform: rotate(180deg);
  }

  .mycenter.arrow-left:hover {
    animation: arrowAnimation 500ms infinite;
  }

  .mycenter.arrow-right:hover {
    animation: arrowAnimation 500ms infinite;
  }

  @keyframes arrowAnimation {
    0% {
      background-position: center;
    }
    50% {
      background-position: left;
    }
    100% {
      background-position: center;
    }
  }

  .dialog {
    position: absolute;
    z-index: 999;
    top: 60px;
    left: 0;
    right: 0;
    min-width: 1200px;
    min-height: calc(100% - 60px);
    background-color: #404b69;
    transition: opacity .5s ease, transform .5s ease;
  }

  .dialog.fadeAndSlide-enter-active {
    opacity: 0;
    transform: translate(100%, 0);
  }

  .dialog.fadeAndSlide-enter-to {
    opacity: 1;
    transform: translate(0, 0);
  }

  .dialog.fadeAndSlide-leave-active {
    opacity: 1;
    transform: translate(0, 0);
  }

  .dialog.fadeAndSlide-leave-to {
    opacity: 0;
    transform: translate(100%, 0);
  }

  .dialog-container {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .compatible {
    height: 46px;
    line-height: 46px;
    background-color: #3d99d2;
    color: #fff;
  }

  .compatible-w {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    font-size: 16px;
    position: relative;
  }

  .compatible-w span {
    font-size: 24px;
    position: absolute;
    right: 2px;
    cursor: pointer;
  }

  .minHeight {
    min-height: -webkit-calc(100vh - 291px);
    min-height: calc(100vh - 291px)
  }

  .cat {
    position: fixed;
    left: 10px;
    bottom: 20px;
    width: 450px;
    height: 450px;
    z-index: 999;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 10px #dadbdc;
  }

  .close {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 0;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
</style>

