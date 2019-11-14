<template>
  <div class="cont">

    <p class="title" v-if="state === 1">{{$t('usercontent.user24')}}</p>
    <div class="ear" v-if="state === 1">
      <div class="qrcode">
        <div class="bind-qrcode-img" ref="qrcode"></div>
        <p class="qrcode-p">{{bindGoogleKey}}</p>
      </div>
      <div class="right">
        <p>{{$t('usercontent.user25')}}</p>
        <p>{{$t('usercontent.user26')}}</p>
        <p>{{$t('usercontent.user27')}}</p>
        <p v-html="$t('usercontent.user28')"></p>
        <p>{{$t('usercontent.user29')}}</p>
      </div>
    </div>
    <div class="verify-input">
      <p class="title">{{$t('usercontent.user30')}}</p>
      <input type="text" v-model="key"/>
    </div>
    <div class="verify-input">
      <p class="title">{{$t('account.user_center_login_password')}}</p>
      <input :type="showPass?'text':'password'" v-model="password"/>
      <div class="pwd-isShow" @click="showPass=!showPass">
        <img src="../../../assets/img/show_password.png" alt="" style="opacity: 0.8;" v-if="showPass">
        <img src="../../../assets/img/hide_password.png" alt="" style="opacity: 0.8;" v-else>
      </div>
    </div>
    <div class="operation">
      <button class="black" @click="cancal()">{{$t('usercontent.user31')}}</button>
      <button class="orange" @click="getKey()">{{$t('usercontent.user32')}}</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import userApi from '@/api/individual'
  import utils from '@/assets/js/utils'
  import {mapGetters} from 'vuex'

  export default {
    name: 'goole-verify',
    props: ['state'],
    data () {
      return {
        bindGoogleKey: null,
        key: null,
        password: null,
        showPass: false
      }
    },
    created () {
      if (this.state === 1) {
        this.getGoogleKey()
      }
      //console.log(this.getUserInfo().username)
    },
    methods: {
      ...mapGetters(['getUserInfo']),
      getGoogleKey () {
        userApi.createGoogleKey(res => {
          this.bindGoogleKey = res.msg
          var qrCode = `otpauth://totp/${window.location.host}:${this.getUserInfo().username}?secret=${res.msg}&digits=6&issuer=${window.location.host}&period=30`
          utils.qrcode(this.$refs.qrcode, {
            width: 150,
            height: 150,
            text: qrCode
          })
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      cancal () {
        this.$emit('removeDialog')
      },
      getKey () {
        if (!this.key) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`usercontent.user33`)})
        } else if (!this.password) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`public0.public265`)})
        } else {
          this.$emit('okCallback', this.key, this.bindGoogleKey, this.password)
          this.$emit('removeDialog')
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    width: 920px;
    background: #ffffff;
    padding: 30px 40px;
    color: #19181c;

    .ear {
      background: #d8d8da;
      padding: 9px 6px;
      margin-top: 15px;
      display: flex;
      color: #19181c;
      font-size: 14px;
      line-height: 24px;
      text-align: justify;

      .qrcode {
        width: 150px;
        padding-right: 10px;
        flex-shrink: 0;

        .qrcode-p {
          word-wrap: break-word
        }

        .bind-qrcode-img {
          background: #c7c7c7;
          width: 150px;
          height: 150px;
        }
      }
    }

    .verify-input {
      margin-top: 25px;
      display: flex;
      flex-flow: column;
      position: relative;

      input {
        border-bottom: 1px solid rgba(21, 23, 32, .08);
        height: 24px;
        padding: 5px;
      }

      .pwd-isShow{
        position: absolute;
        right: 10px;
        top: 20px;
        img {
          width: 20px;
          cursor: pointer;
        }
      }
    }

    .operation {
      margin-top: 45px;
      text-align: right;

      button {
        border-bottom: 2px solid #19181c;
        padding: 0 4px;
        height: 34px;
        background: none;
        cursor: pointer;

        &.orange {
          border-bottom: 2px solid #00a0e9;
          margin-left: 30px;
        }
      }
    }
  }
</style>
