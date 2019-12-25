<template>
  <div class="cont_bg">
    <div class="abcenter text-center f-c-white">
      <p class="fs20 efont">{{$t('login_register.acWelcome')}}<!-- 欢迎致辞 --></p>
      <p class="mt45 fs16">{{$t('login_register.acText_1')}}<!-- 账户激活邮件已经发送至 --> <span class="f-c-main">{{$route.query.email}}</span>
      </p>
      <p class="mt5 fs16">{{$t('login_register.acText_2')}}<!-- 请打开邮件并点击里面提供的链接来激活您的账户。 --><span
        v-html="$t('login_register.acText_3').format(`“ <span class=f-c-main>noreply@gcox.com</span> ”`)"></span>
        <!-- 如果您未在收件箱看到来自“ <span class="f-c-main">noreply@gcox.com</span> ”的邮件，请再确认一下垃圾邮件。 --></p>
      <p class="mt5 fs16">{{$t('login_register.acText_4')}}<!-- 如未收到账户激活邮件，请点击下面的按钮重新发送 --></p>
      <p class="mt60">
        <button type="button"
                class="mint-btn primary round"
                :style="{cursor: locked ? 'pointer' : 'no-drop'}"
                @click="send">
          {{$t('login_register.acResend')}}<span v-show="this.second !== '00' && !loading">({{this.second}})</span><!-- 重新发送账户激活邮件 --></button>
      </p>
    </div>
    <loading class="load" v-show="loading"/>
  </div>

</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import userApi from '@/api/user'
  import Config from '@/assets/js/config'
  import utils from '@/assets/js/utils'

  export default {
    data () {
      return {
        locked: false,
        second: '60',
        loading: false
      }
    },
    computed: {
      ...mapGetters(['getLang'])
    },
    created () {
      this.sendEmail()
    },
    methods: {
      secondDown () {
        utils.countDown(60, (time) => {
          this.second = time.split(':')[1]
          if (this.second === '00') {
            this.locked = true
          }
        })
      },
      sendEmail () {
        let email = this.$route.query.email
        this.loading = true
        userApi.sendActivateEmail({
          lang: this.getLang === 'zh-CN' || this.getLang === 'cht' ? 'cn' : 'en',
          email: email,
          redirectUrl: `${Config.origin}/login`
        }, (msg) => {
          this.secondDown()
          this.loading = false
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({
            icon: 'notification',
            message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
          })
        })
      },
      send () {
        if (this.locked) {
          this.sendEmail()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .abcenter {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1190px;
    margin: 0 auto;
  }

  .cont_bg {
    background: #1f1e24;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .load{
    position: fixed;
    left: 50%;
    top: 42%;
    margin-left: -25px !important;
  }
</style>


