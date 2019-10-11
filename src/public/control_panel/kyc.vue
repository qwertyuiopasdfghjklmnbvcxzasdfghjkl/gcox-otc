<template>
  <div class="w1200 warp">
    <div></div>
    <div>
      <anthentication/>
    </div>
  </div>
</template>

<script>
  import anthentication from '../authen/index'

  export default {
    name: 'kyc',
    components: {anthentication},
    data () {
      return {}
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped lang="less">
.warp{
  margin: 40px auto;
}
</style>
