<template>
  <div class="warp">
    <div class="top">
      <p class="w1200">{{$t('user.set')}}</p>
    </div>
    <div class="w1200">
      <div class="box">
        <collapse :title="$t('gcox_otc.tow_v')">
          <div class="google">
            <h2>{{$t('gcox_otc.tow_v')}}</h2>
            <p v-if="userInfo.googleAuthEnable === 0"
               v-html="$t('gcox_otc.google_tip').format($t('public0.public194_Low'),'red',$t('user.verify'))"></p>
            <p v-else
               v-html="$t('gcox_otc.google_tip').format($t('public0.public194_High'),'green',$t('public0.public42'))"></p>
            <button @click="banding()">{{userInfo.googleAuthEnable === 0?
              $t('gcox_otc.star_use'):$t('public0.public42')}}
            </button>
          </div>
        </collapse>
      </div>

      <div class="box">
        <collapse :title="$t('gcox_otc.vote')">
          <div class="set_msg">
            <div>
              <h4>{{$t('gcox_otc.email_message')}}</h4>
              <div>
                <p>
                  <span>{{$t('gcox_otc.new_deal')}}</span>
                  <span><switch-vi :size="'leg'" :background="'#29CDA7'" :open-text="'ON'"/></span>
                </p>
                <p>
                  <span>{{$t('gcox_otc.deal_change')}}</span>
                  <span><switch-vi :size="'leg'" :background="'#29CDA7'"  :open-text="'ON'"/></span>
                </p>
                <p>
                  <span>{{$t('gcox_otc.deal_msg')}}</span>
                  <span><switch-vi :size="'leg'" :background="'#29CDA7'"  :open-text="'ON'"/></span>
                </p>
              </div>
            </div>
            <div>
              <h4>{{$t('gcox_otc.tell_message')}}</h4>
              <div>
                <p>
                  <span>{{$t('gcox_otc.new_deal')}}</span>
                  <span><switch-vi :size="'leg'" :background="'#29CDA7'"  :open-text="'ON'"/></span>
                </p>
                <p>
                  <span>{{$t('gcox_otc.deal_pay')}}</span>
                  <span><switch-vi :size="'leg'" :background="'#29CDA7'"  :open-text="'ON'"/></span>
                </p>
              </div>
            </div>
          </div>
        </collapse>
      </div>

      <div class="box">
        <collapse :title="$t('home.intro')">
          <div class="intro">
            <label>
              <span>{{$t('home.home08')}}</span>
              <input :value="userInfo.email" disabled>
            </label>
            <label>
              <span>{{$t('otc_exchange.otc_exchange_username')}}</span>
              <input>
            </label>
            <label>
              <span>{{$t('public0.public78')}}</span>
              <input>
            </label>
            <label>
              <span>{{$t('gcox_otc.daily_rate')}}</span>
              <span><switch-vi :size="'leg'" :background="'#29CDA7'"  :open-text="'ON'"/></span>
            </label>
            <label>
              <span>{{$t('shop.phone')}}</span>
              <span class="red w2">{{$t('user.verify')}}</span>
              <span><button>{{$t('gcox_otc.change_tell')}}</button></span>
            </label>
            <label>
              <span>{{$t('gcox_otc.user_state')}}</span>
              <span class="green w3">{{$t('gcox_otc.no_submit')}}</span>
              <span><button>{{$t('gcox_otc.update_file')}}</button></span>
            </label>
          </div>
        </collapse>
      </div>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import Collapse from './set/collapse'
  import userUtils from '@/api/individual'
  import utils from '@/assets/js/utils'
  import googleVerify from '../mycenter/mycenter/google-verify'
  import userApi from '@/api/user'
  import SwitchVi from '../../components/switch-vi'

  export default {
    name: 'set',
    components: {SwitchVi, Collapse},
    data () {
      return {
        userInfo: {}
      }
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getLang'])
    },
    created () {
      this.userInfo = this.getUserInfo
    },
    methods: {
      ...mapActions(['setUserInfo']),
      banding () {
        if (this.userInfo.googleAuthEnable === 0) {
          this.googleVerify(1)
        } else {
          this.googleVerify(2)
        }
      },
      googleVerify (i) {
        utils.setDialog(googleVerify, {
          state: i,
          okCallback: (res) => {
            let data = {
              googleCode: res
            }
            this.showLoading = true
            if (i === 1) {
              userUtils.bindGoogleAuth(data, msg => {
                userApi.getUserInfo((userInfo) => {
                  this.showLoading = false
                  this.userInfo = userInfo
                  this.setUserInfo(userInfo)
                })
                Vue.$koallTipBox({icon: 'success', message: this.$t('error_code.' + msg), delay: 3000})
              }, msg => {
                this.showLoading = false
                Vue.$koallTipBox({icon: 'notification', message: this.$t('error_code.' + msg), delay: 3000})
              })
            } else {
              userUtils.unbindGoogleAuth(data, res => {
                userApi.getUserInfo((userInfo) => {
                  this.showLoading = false
                  this.userInfo = userInfo
                  this.setUserInfo(userInfo)
                })
                Vue.$koallTipBox({icon: 'success', message: this.$t('error_code.' + res), delay: 3000})
              }, msg => {
                this.showLoading = false
                Vue.$koallTipBox({icon: 'notification', message: this.$t('error_code.' + msg), delay: 3000})
              })
            }
          }
        })
      }
    }

  }
</script>

<style scoped lang="less">
  .top {
    background: #13143A;
    height: 40px;
    padding: 40px 0;
    font-size: 24px;
    color: #ffffff;
  }

  .box {
    margin: 10px auto;
    font-size: 16px;
  }

  .google {
    margin: 25px 20px;
    box-shadow: 0 0 10px #dedede;
    background: #ffffff;
    padding: 20px;
    text-align: center;

    h2 {
      font-size: 30px;
      font-weight: 400;
      padding: 10px 0;

      p {
        font-size: 18px;
        padding: 10px;
      }
    }

    button {
      width: 136px;
      height: 50px;
      background: rgba(240, 185, 54, 1);
      border-radius: 3px;
      color: #ffffff;
      margin: 15px auto;
    }
  }
  .set_msg{
    margin: 20px;
    &>div{
      border-bottom: 1px solid #E6E6E6;
      padding: 20px 0;
      &:last-child{
        border-bottom: none;
      }
      h4{
        text-align: center;
        font-size: 24px;
        font-weight: 400;
        padding: 10px;
      }
      &>div{

         p{
           display: flex;
           align-items: center;
           font-size: 18px;
           span{
             width: 50%;
             padding: 6px 30px;
             &:first-child{
               text-align: right;
             }
           }
         }
       }
    }
  }
  .intro{
    padding: 20px;
    label{
      display: flex;
      padding: 10px;
      align-items: center;
      &>span:first-child{
        width: 500px;
        text-align: right;
        margin-right: 15px;
      }
      input{
        width: 500px;
        padding: 10px;
        height: 30px;
        background: #eeeeee;
        border-radius:3px;
      }
      .w2, .w3{
        width: 380px;
      }
      span{
        button{
          width:140px;
          height:40px;
          background:rgba(240,185,54,1);
          border-radius:3px;
          font-size: 16px;
          color: #ffffff;
        }
      }
    }
  }

</style>
