<template>
    <div class="collapse">
      <div class="collapse-title" :class="{'active_nav': show}" @click="show = !show">
        <p v-html="title"></p>
        <span><img src="../../../assets/img/icon-otc10.png"></span>
      </div>
      <div class="collapse-cont" :class="{'active': show}">
        <slot></slot>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'collapse',
    props: ['title'],
    data () {
      return {
        show: true
      }
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped lang="less">
.collapse{
  .collapse-title{
    background: #EEEEEE;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    transition: 0.3s;
    &.active_nav{
      background: #13143A;
      color: #ffffff;
    }
  }
  .collapse-cont{
    background: #F6F6F6;
    height: 0;
    transition: 0.3s;
    overflow: hidden;
    &.active{
      height: initial;
    }
  }
}
</style>
