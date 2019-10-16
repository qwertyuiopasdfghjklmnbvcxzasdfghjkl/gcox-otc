<template>
  <div class="card">
    <div class="title">
      <slot name="title">
        <p v-if="title">{{title}}</p>
      </slot>
    </div>
    <div class="card_cont">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'card',
    props: ['title'],
    data () {
      return {}
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped lang="less">
  .card {
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 0 10px #64676b;
  }
  .title{
    padding: 15px;
    border-bottom: 1px solid #eeeeee;
    font-size: 18px;
    p{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .card_cont{
    padding: 20px;
  }
</style>
