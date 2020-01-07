<template>
  <div class="message">
    <p>{{$t('usercontent.user55')}}</p>
    <div class="message-cont">
      <p class="back" v-if="showCont">{{$t('usercontent.user64')}}</p>
      <ul class="message-list" v-if="!show && datas.length > 0&&!showCont">
        <li class="message-item" :class="{markread: item.msgType === 3}" v-for="(item, index) in datas"
            :key="index">
          <p class="message-item-title" @click="markItemRead(item)">
            <span class="main">{{formatSystemMessage(item.title, item.msgType !== 5)}}</span>
            <span class="time">{{item.msgTime}}</span>
          </p>
          <!--<div class="message-item-cont" v-show="item.show">-->
          <!--<div class="inner">{{formatSystemMessage(item.body, item.msgType !== 5)}}</div>-->
          <!--</div>-->
        </li>
      </ul>
      <page v-if="!show && datas.length > 0 && !showCont"
            :pageIndex="formData.page" :pageSize="formData.show"
            :total="total" @changePageIndex="pageChange"/>

      <div class="message-nodata" v-if="!show && datas.length === 0">
        <div class="message-nodata-icon icon-no-order"></div>
        <div class="message-nodata-text">{{$t('message.no_message')}}<!--暂无站内消息--></div>
      </div>
      <loading v-if="show"/>
      <div class="content" v-if="showCont">
        <div v-html="body">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import msgApi from '@/api/individual'
  import loading from '@/components/loading'
  import page from '@/components/page'
  import utils from '@/assets/js/utils'

  export default {
    components: {
      loading,
      page
    },
    data () {
      return {
        show: true,
        formData: {
          show: 20,
          page: 1,
        },
        totalItem: null,
        totalPage: null,
        datas: [],
        unReadLength: 0,
        body: null,
        showCont: false,
        total: 0
      }
    },
    computed: {},
    watch: {},
    created () {
      this.getList()
      // this.getUnReadLength()
    },
    methods: {
      formatSystemMessage: utils.formatSystemMessage,
      getList () {
        msgApi.getMessages(this.formData, (res) => {
          this.total = res.total
          this.totalPage = Math.max(1, Math.ceil(res.total / this.formData.showItem))
          res.data.forEach((item) => {
            item.show = false
          })
          this.datas = res.data
          this.show = false
        }, (msg) => {
          if (msg === 'NOT_FIND_MESSAGE') {
            this.show = false
          } else {
            console.error(msg)
          }
        })
      },
      getUnReadLength () {
        // 参数为空时获取所有未读消息
        msgApi.getMessages({}, (res) => {
          this.unReadLength = res.data.length
        })
      },
      pageChange (currentIndex) {
        this.formData.page = currentIndex
        this.getList()
      },
      markItemRead (item) {
        let link = JSON.parse(item.link)
        console.log(link)
        if (item.msgType === 3) {
          this.$router.push({name: 'otc_detail', query: {id: link.order_id}})
        }

        // return;
        // this.showCont = !this.showCont
        // this.body = item ? item.body : ''
        // item.show = item.show === false
        // if (item.messageState === 0) {
        //   msgApi.markItemRead({
        //     messageId: item.messageId
        //   }, (msg) => {
        //     item.messageState = 1
        //     this.unReadLength--
        //   })
        // }
      }
    }
  }
</script>

<style scoped lang="less">
  .message {
    color: #333333;
    border: 1px solid #eeeeee;;
    padding: 20px;
    min-height: 200px;

    .message-nodata {
      text-align: center;
      margin: 30px auto;
    }

    ul {
      margin-top: 20px;

      .message-item {
        border-top: 1px solid #eeeeee;
        cursor: pointer;
      }
    }

    .message-item-title {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid hsla(240, 4%, 89%, .1);
      padding-right: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #666666;

      .main {
        width: 76%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        color: #333;
        font-size: 12px;
      }
    }

    .back {
      margin: 18px 0;
      display: inline-block;
      cursor: pointer;
    }
  }
  .markread{
    .main{
      font-weight: bold;
    }
  }
</style>
