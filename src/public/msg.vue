<template>
    <div class="w1200 cont">
      <message/>
    </div>
</template>

<script>
  import Message from './mycenter/message'
  export default {
    name: 'msg',
    components: {Message},
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
