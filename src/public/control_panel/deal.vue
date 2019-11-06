<template>
    <div class="w1200 warp">
      <orderlist :ip="ip"></orderlist>
    </div>
</template>

<script>
  import Orderlist from '../../otc/otchome/orderlist'
  export default {
    name: 'deal',
    components: {Orderlist},
    data () {
      return {
        ip: null
      }
    },
    created () {
      this.ip = this.$route.params.ip
    },
    methods: {}

  }
</script>

<style scoped>
  .warp{
    overflow: auto;
  }
</style>
