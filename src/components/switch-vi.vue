<template>
  <div class="cont" @click="_s()" :class="{'active': value}">
    <span class="radiu"></span>
  </div>
</template>

<script>
  export default {
    name: 'switch-vi',
    props: {
      value: {
        default: false,
        type: Boolean
      }
    },
    data () {
      return {}
    },
    created () {

    },
    methods: {
      _s () {
        this.value = !this.value
        this.$emit('change', this.value)
      }
    }

  }
</script>

<style scoped lang="less">
  .cont {
    width: 32px;
    height: 18px;
    border-radius: 20px;
    background: #ccc;
    position: relative;
    display: inline-block;
    margin: 8px;
    cursor: pointer;
    transition: .3s;
    &.active{
      background: #F0B936;
      .radiu{
        left: 14px;
      }
    }
    .radiu {
      width: 18px;
      height: 18px;
      position: absolute;
      background: #ffffff;
      border-radius: 50%;
      left: 0;
      top: 0;
      transition: .3s;
    }
  }
</style>
