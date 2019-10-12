<template>
  <div class="content">
    <ul class="ul-nav">
      <li>
        <!--（1：公告、2：资讯、3：关于我们、4：交易、5：帮助中心、6：条款说明）-->
        <router-link :to="{name: 'about'}" :class="{'router-link-active':type === 'about'}">
          <i></i>
          <span>{{$t('usercontent.user81')}}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'deal'}" :class="{'router-link-active':type === 'deal'}">
          <i></i>
          <span>{{$t('usercontent.user82')}}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'help'}" :class="{'router-link-active':type === 'help'}">
          <i></i>
          <span>{{$t('usercontent.user83')}}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'clause'}" :class="{'router-link-active':type === 'clause'}">
          <i></i>
          <span>{{$t('usercontent.user84')}}</span>
        </router-link>
      </li>
    </ul>
    <div class="right-cont">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        type: null
      }
    },
    watch: {
      '$route' () {
        //console.log(this.$route.params.type)
        this.type = this.$route.params.type
      }
    },
    created () {
      //console.log(this.$route.params.type)
      this.type = this.$route.params.type
    }
  }
</script>

<style scoped lang="less">
  .content {
    width: 1200px;
    margin: 0 auto;
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .ul-nav {
      width: 220px;
      /*flex: 1;*/
      background: #fff;
      border: 1px solid #eeeeee;
      border-radius:4px;
      li:last-child{
        span{
          border-bottom: none;
        }
      }

      a {
        display: block;
        font-size: 16px;
        overflow: hidden;
        position: relative;

        span {
          display: block;
          border-bottom: 1px solid #eeeeee;
          color: #333;
          padding: 18px 0;
          text-indent: 50px;
        }


        &.router-link-active {
          span {
            color: #fff;
            background: #F0B936;
          }

        }
      }
    }

    .right-cont {
      width: 950px;
      /*flex: 1;*/
    }
  }
</style>
