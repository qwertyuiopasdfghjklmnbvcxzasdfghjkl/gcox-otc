<template>
    <div class="w1200">
      <digassets :pandect="pandect"></digassets>
    </div>
</template>

<script>
  import Digassets from '../account/digassets'
  export default {
    name: 'wallet',
    components: {Digassets},
    data () {
      return {
        pandect: {
          hiddenZore: false,
          showTraList: false
        }
      }
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped>

</style>
