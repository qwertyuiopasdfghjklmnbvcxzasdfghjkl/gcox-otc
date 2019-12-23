<template>
  <div class="cont">
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
