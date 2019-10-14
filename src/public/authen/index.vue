<!--<template>-->
  <!--<div class="authentication">-->
    <!--<h3>{{$t('account.user_Real_name_verification')}}&lt;!&ndash;实名认证&ndash;&gt;</h3>-->
    <!--&lt;!&ndash;<div class="tab">&ndash;&gt;-->
      <!--&lt;!&ndash;<ul class="tab-list">&ndash;&gt;-->
        <!--&lt;!&ndash;<li class="tab-item" :class="[active==='china'?'active':'']" @click="switch_tabs('china')">&ndash;&gt;-->
          <!--&lt;!&ndash;{{$t('public0.public75')}}&lt;!&ndash;中国大陆&ndash;&gt;&ndash;&gt;-->
        <!--&lt;!&ndash;</li>&ndash;&gt;-->
        <!--&lt;!&ndash;<li class="tab-item" :class="[active==='other'?'active':'']" @click="switch_tabs('other')">&ndash;&gt;-->
          <!--&lt;!&ndash;{{$t('public0.public76')}}&lt;!&ndash;其他国家&ndash;&gt;&ndash;&gt;-->
        <!--&lt;!&ndash;</li>&ndash;&gt;-->
      <!--&lt;!&ndash;</ul>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--<anthentication1 />-->
    <!--&lt;!&ndash;<anthentication2 v-if="active==='other'" @switchTab="switchTab"/>&ndash;&gt;-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import userUtils from '@/api/individual'-->
  <!--import anthentication1 from '@/public/authen/anthentication1'-->
  <!--import anthentication2 from '@/public/authen/anthentication2'-->
  <!--export default {-->
    <!--components: {-->
      <!--anthentication1,-->
      <!--anthentication2-->
    <!--},-->
    <!--data () {-->
      <!--return {-->
        <!--active: 'china'-->
      <!--}-->
    <!--},-->
    <!--created () {-->
      <!--userUtils.getUserState((data) => {-->
        <!--// data.verifyState === 0 ? void 0 : this.$emit('switchTab', 'mycenter')-->
      <!--}, (msg) => {-->
        <!--console.error(msg)-->
      <!--})-->
    <!--},-->
    <!--methods: {-->
      <!--switch_tabs (tab) {-->
        <!--this.active = tab-->
      <!--},-->
      <!--switchTab (tab) {-->
        <!--this.$emit('switchTab', tab)-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->
  <!--.authentication{background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}-->
  <!--.authentication h3{height: 55px; padding-left: 20px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333;text-indent: 8px;border-bottom: 1px solid #e7e7e7;}-->
  <!--.authentication .tab{border-bottom: 1px solid #e7e7e7; padding-left: 30px; height: 60px; line-height: 60px;}-->
  <!--.authentication .tab-item{display: inline-block;margin-right: 20px; height: 61px; line-height: 62px; box-sizing: border-box; border-bottom: -1px; font-size: 16px;color: #666;border-bottom: 2px solid transparent;cursor: pointer;}-->
  <!--.authentication .tab-item.active{color: #3283FF;border-bottom-color: #3283FF;}-->
  <!--.authentication .tab-item:hover {color: #3283FF;}-->

<!--</style>-->



<template>
  <!--KYC认证-->
  <div class="authentication">
    <div class="cont">
      <img :src="imgSrc[getUserInfo.kycState]"/>
      <div v-if="getUserInfo.kycState === -1">
        <p class="f-c-green">{{$t('usercontent.user46')}}</p>
        <span>{{$t('usercontent.user47')}}</span>
      </div>
      <div v-if="getUserInfo.kycState === 0">
        <p>{{$t('usercontent.user85')}}</p>
        <span @click="submitKYC()" style="cursor: pointer" v-html="$t('usercontent.user48')"></span>
      </div>
      <div v-if="getUserInfo.kycState === 1">
        <p class="f-c-green">{{$t('usercontent.user42')}}</p>
        <span>{{$t('usercontent.user43')}}</span>
      </div>
      <div v-if="getUserInfo.kycState === -2 || getUserInfo.kycState === -3">
        <p class="f-c-danger">{{$t('usercontent.user44')}}</p>
        <span @click="submitKYC()" style="cursor: pointer" v-html="$t('usercontent.user45')"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import utils from '@/assets/js/utils'
  import kyc from '@/components/kyc'
  import {mapGetters} from 'vuex'
  import api from '@/api'

  let domain = ''
  export default {
    data () {
      return {
        // 0未通过，1已通过，-1审核中，-2错误，-3拒绝
        imgSrc: {
          '0': require('../../assets/img/userContent/authentication01.png'),
          '1': require('../../assets/img/userContent/authentication03.png'),
          '-1': require('../../assets/img/userContent/authentication02.png'),
          '-2': require('../../assets/img/userContent/authentication04.png'),
          '-3': require('../../assets/img/userContent/authentication04.png'),
        }
      }
    },
    computed: {
      ...mapGetters(['getUserInfo'])
    },
    watch: {
      ...mapGetters(['getUserInfo']),
      getUserInfo () {
        //console.log(this.getUserInfo)
      }
    },
    created () {
    },
    methods: {
      submitKYC () {
        api.get(`${domain}api/v1/gcox/user/initiate-kyc`, (res) => {
          if (res.rst === 1) {
            utils.setDialog(kyc, {redirect_url: res.data.redirect_url})
          } else {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
          }
        }, (msg) => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .authentication {
    color: #979799;
    /*background: rgba(27, 26, 31, 0.8);*/
    padding: 20px;

    .cont {
      text-align: center;
      padding: 50px;

      p {
        line-height: 32px;
      }
    }
  }
</style>

