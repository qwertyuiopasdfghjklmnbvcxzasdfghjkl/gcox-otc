<template>
  <card style="width:750px;">
    <p slot="title">
      <span>{{$t('gcox_otc.add_phone')}}</span>
      <i @click="close()"><img width="14" src="../../../assets/img/close.png"/></i>
    </p>
    <div class="cont">
      <div class="step" v-if="step === 1">
        <div class="box">
          <label class="flag">
            <p @click="showFlag=!showFlag">
              <a class="country-icon" :class="'country-'+mobileFormData.key" :title="mobileFormData.key"></a>
            </p>
            <ul v-if="showFlag">
              <li v-for="item in areaCodeList" :value="item.code" @click="change(item)">
                <a class="country-icon" :class="'country-'+item.key" :title="$t(`countrys.${item.key}`)"></a>
                <span>{{$t(`countrys.${item.key}`)}}</span>
                {{item.code}}
              </li>
            </ul>
          </label>
          <input :class="{error: errors.has('phoneNumber')}" type="text" v-model="mobileFormData.phoneNumber"
                 v-validate="'required'" data-vv-name="phoneNumber"/>
        </div>
        <em class="error red" v-if="showerror">
          {{$t('public0.public6')}}
        </em>
        <p class="btn">
          <button class="yellow_button" @click="next(2)">{{$t('gcox_otc.next')}}</button>
        </p>
      </div>

      <div class="step" v-if="step === 2">
        <div class="box column">
          <p class="">{{$t('gcox_otc.input_sms')}}</p>
          <input v-model="mobileFormData.smsCode" :placeholder="$t('login_register.verify_code')"/>
        </div>
        <p class="btn">
          <button class="" @click="step = 1">{{$t('gcox_otc.back')}}</button>
          <button class="yellow_button" @click="bind()" :class="{'dis':mobileFormData.smsCode}">
            {{$t('gcox_otc.next')}}
          </button>
        </p>
      </div>
    </div>
  </card>
</template>

<script>
  import Vue from 'vue'
  import Card from '../../../components/card'
  import commonConfig from '@/assets/js/commonConfig'
  import userApi from '@/api/individual'

  export default {
    name: 'bind-phone',
    components: {Card},
    data () {
      return {
        mobileFormData: commonConfig.default,
        areaCodeList: commonConfig.areaCodeList,
        showFlag: false,
        step: 1,
        showerror: false
      }
    },
    watch: {
      'mobileFormData.phoneNumber' () {
        this.showerror = false
      }
    },
    created () {

    },
    methods: {
      change(item){
        this.mobileFormData.code = item.code;
        this.mobileFormData.key = item.key;
        this.showFlag=false
      },
      close () {
        this.$emit('removeDialog')
      },
      next (i) {
        if (this.mobileFormData.phoneNumber) {
          this.sendSMSCode(i)
        } else {
          this.showerror = true
        }
      },
      sendSMSCode (i) {
        userApi.sendAuthSMSCode({
          countryCode: this.mobileFormData.code,
          phoneNumber: this.mobileFormData.phoneNumber
        }, (msg) => {
          // let timeOut = () => {
          //   this.time--
          //   if (this.time === 0) {
          //     this.disabled = false
          //     this.time = 60
          //     return
          //   }
          //   setTimeout(timeOut, 1000)
          // }
          // this.time = 60
          // setTimeout(timeOut, 1000)
          this.step = i
          Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      bind () {
        if (this.mobileFormData.smsCode) {
          let formData = {
            countryCode: this.mobileFormData.code,
            phoneNumber: this.mobileFormData.phoneNumber,
            smsCode: this.mobileFormData.smsCode
          }
          userApi.bindMobile(formData, (msg) => {
            this.showBindMobile = false
            this.disabled = false
            Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
            this.$emit('okCallback')
          }, (msg) => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        }
      }
    }

  }
</script>

<style scoped lang="less">
  .flag {
    width: 60px;
    height: 50px;
    position: relative;
    display: inline-flex;
    align-items: center;
    margin-right: 20px;

    & > p {
      display: flex;
      align-items: center;
      position: relative;
      justify-content: space-between;
      flex: 1;

      &:after {
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-top-color: #707a7f;
      }
    }

    & > ul {
      position: absolute;
      left: 0;
      top: 50px;
      background: #ffffff;
      box-shadow: 0 0 4px #dedede;
      border-radius: 4px;
      height: 30vh;
      overflow-y: auto;

      li {
        padding: 10px;
        display: flex;
        align-items: center;
        transition: 0.3s;
        white-space: nowrap;

        span {
          padding: 0 4px;
        }

        &:hover {
          background: #eeeeee;
        }
      }
    }
  }

  .step {
    padding: 20px 40px;

    .box {
      display: flex;
      align-items: center;

      input {
        flex: 1;
        height: 30px;
        border: 1px solid #eeeeee;
        padding: 10px;
        display: block;
      }
    }

    .column {
      display: block;

      & > p {
        height: 20px;
        padding: 15px;
        background: #f3f3f3;
        text-align: center;
        margin-bottom: 20px;
      }

      input {
        width: 608px;
      }
    }
  }

  .error {
    display: block;
    margin: 10px 0;
  }

  .btn {
    margin: 30px auto;
    display: flex;
    justify-content: center;

    button {
      width: 129px;
      height: 50px;
      border-radius: 3px;
      margin: 0 20px;
    }
  }

</style>
