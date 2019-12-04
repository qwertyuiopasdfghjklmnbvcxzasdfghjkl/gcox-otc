<template>
  <div class="cont" :style="style">
    <p class="title"  v-if="state === 1">{{$t('usercontent.user24')}}</p>
    <p class="title" :class="{'tow_title': state === 0}" v-if="state === 0">
      {{$t('usercontent.user30')}}</p>
    <div class="ear" v-if="state === 1">
      <div class="qrcode">
        <div class="bind-qrcode-img" ref="qrcode"></div>
        <p class="qrcode-p">{{bindGoogleKey}}</p>
        <loading v-if="loading" class="load"/>
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
      <p class="title">{{$t('usercontent.user33')}}</p>
      <input type="text" :class="{'tow_input': state === 0}" v-model="key"/>
    </div>
    <div class="operation" :class="{'tow_btn': state === 0}">
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
    props: ['state','style'],
    data () {
      return {
        bindGoogleKey: null,
        key: null,
        loading: true
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
          this.loading = false
        }, (msg) => {
          this.loading = false
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      cancal () {
        this.$emit('removeDialog')
      },
      getKey () {
        if (!this.key) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`usercontent.user33`)})
        } else {
          this.$emit('okCallback', this.key)
          this.$emit('removeDialog')
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    width: 700px;
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
        position: relative;
        .load{
          position: absolute;
          top: 25px;
          left: 50%;
          margin-left: -25px;
        }

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

      input {
        border-bottom: 1px solid rgba(21, 23, 32, .08);
        height: 24px;
        padding: 5px;
      }
      .tow_input{
        border: 1px solid #dadada;
        margin-top: 10px;
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
    .tow_btn{
      text-align: center;
      button{
        background: #858585;
        border-bottom: none;
        padding: 2px 26px;
        border-radius: 40px;
        color: #ffffff;
        &.orange {
          border-bottom: none;
          margin-left: 20px;
          background: #00a0e9;
        }
      }
    }
  }
  .tow_title{
    text-align: center;
    border-bottom: 1px solid #dadada;
    padding-bottom: 20px;
    font-size: 16px;
    margin: -10px -40px 10px -40px;
  }
</style>
