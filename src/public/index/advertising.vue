<template>
    <div class="cont w1200">
      <div class="title">
        <p>
          <span>{{$t('gcox_otc.base')}}</span>
          <span>{{$t('gcox_otc.detail')}}</span>
        </p>
      </div>
      <div class="list">
        <div>
          <p class="tit">{{$t('gcox_otc.i_want')}}</p>
          <label>
            <span>{{$t('gcox_otc.buy')}}Ethereum</span>
            <span>{{$t('gcox_otc.sell')}}Ethereum</span>
          </label>
        </div>
        <div>
          <p class="tit">Change coin</p>
          <label>
            <p>Ethereum</p>
          </label>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'advertising',
    data () {
      return {}
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped>

</style>
