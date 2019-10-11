<template>
    <div class="w1200 warp">
      <orderlist></orderlist>
    </div>
</template>

<script>
  import Orderlist from '../../otc/otchome/orderlist'
  export default {
    name: 'deal',
    components: {Orderlist},
    data () {
      return {}
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped>
  .warp{
    overflow: auto;
  }
</style>
