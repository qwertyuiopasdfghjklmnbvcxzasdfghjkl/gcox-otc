<template>
    <div class="w1200 cont">
      <referral></referral>
    </div>
</template>

<script>
  import Referral from './mycenter/referral'
  export default {
    name: 'invite',
    components: {Referral},
    data () {
      return {}
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped>
.cont{
  margin: 30px auto;
}
</style>
