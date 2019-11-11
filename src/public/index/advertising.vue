<template>
  <div class="cont">
    <!--<div class="title">-->
    <!--<p>-->
    <!--<span>{{$t('gcox_otc.base')}}</span>-->
    <!--<span>{{$t('gcox_otc.detail')}}</span>-->
    <!--</p>-->
    <!--</div>-->
    <!--<div class="list">-->
    <!--<div>-->
    <!--<p class="tit">{{$t('gcox_otc.i_want')}}</p>-->
    <!--<label>-->
    <!--<span>{{$t('gcox_otc.buy')}}Ethereum</span>-->
    <!--<span>{{$t('gcox_otc.sell')}}Ethereum</span>-->
    <!--</label>-->
    <!--</div>-->
    <!--<div>-->
    <!--<p class="tit">Change coin</p>-->
    <!--<label>-->
    <!--<p>Ethereum</p>-->
    <!--</label>-->
    <!--</div>-->
    <!--</div>-->
    <div class="top">
      <p class="w1200">{{$t('gcox_otc.new_advertising')}}</p>
    </div>
    <div class="w1200">
      <createorder :myPayType="myPayType" :params="params"></createorder>
    </div>
  </div>
</template>

<script>
  import Createorder from '../../otc/otchome/createorder'

  export default {
    name: 'advertising',
    components: {Createorder},
    data () {
      return {
        myPayType: {},
        params: {}
      }
    },
    created () {
      this.myPayType = this.$route.params.myPayType
      this.params = this.$route.params.params
      if (!this.myPayType && !this.params) {
        this.$router.push({name: 'home'})
      }
    },
    methods: {

    }

  }
</script>

<style scoped lang="less">
  .top {
    height: 120px;
    background: #13143A;
    overflow: auto;

    p {
      color: #ffffff;
      font-size: 24px;
      margin-top: 45px;
    }
  }
</style>
