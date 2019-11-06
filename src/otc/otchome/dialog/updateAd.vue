<template>
  <Card>
    <p slot="title">
      <span>{{$t('otc_ad.otc_edit_ad')}}</span>
      <a class="icon-close" href="javascript:;" @click="closeDialog"></a>
    </p>
    <div class="cont">
      <createorder :my-pay-type="myPayType" :params="params" :ad_id="ad_id" @back="okClose"/>
    </div>

  </Card>
</template>

<script>
  import Createorder from '../createorder'
  import Card from '../../../components/card'

  export default {
    name: 'updateAd',
    props: ['params', 'ad_id', 'myPayType'],
    components: {Card, Createorder},
    data () {
      return {}
    },
    created () {

    },
    methods: {
      closeDialog () {
        this.$emit('removeDialog')
      },
      okClose () {
        this.$emit('okCallback')
        this.closeDialog()
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    height: 80vh;
    overflow-y: auto;
  }
</style>
