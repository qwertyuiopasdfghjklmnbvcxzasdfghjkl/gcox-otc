<template>
  <div ref="chat" class="chat" :style="cursorStyle" @click="markRead">
    <p class="">{{$t('gcox_otc.send_msg_to').format(curOrder && curOrder.opposite_user_name || '--')}} </p>
    <div class="chat-body">
      <div class="chat-body-right">
        <div class="chat-body-right-content" ref="content" @mousewheel="mouseWheel($event, 2)">
          <ul class="chat-msgs-list" v-if="curOrder">
            <mycomponent v-for="(data, index) in messages" :is="getTemplate(data)" :data="data"
                         :fromImage="curOrder.opposite_user_header || avatarUrl"
                         :selfImage="curOrder.user_header || avatarUrl" :key="index"
                         :formatSystemMessage="formatSystemMessage"></mycomponent>
          </ul>
        </div>
      </div>
    </div>
    <div class="chat-body-right-send">
      <div class="send-container">
        <input type="text" v-model="message" :readonly="isReadOnly" class="send-input" maxlength="100"
               :placeholder="$t('public0.public250')" @keyup.enter="sendMessage"/>
        <span type="button" class="send-btn icon-send" :class="{disabled:isReadOnly}" @click="sendMessage"> {{$t('public0.public161')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'
  import avatar from '@/assets/images/touxiang.png'

  Vue.component('selfTemplate', {
    template: `<li class="chat-msgs-item">
    <div class="chat-msgs-item-time">{{data.created_at || data.msg_time}}</div>
    <div class="chat-msgs-item-content right">
        <div class="chat-msgs-item-message self">{{data.message}}</div>
      <div class="chat-msgs-item-image"><img :src="selfImage"/></div>
    </div>
  </li>`,
    props: {
      data: null,
      selfImage: null
    }
  })
  Vue.component('fromTempalte', {
    template: `<li class="chat-msgs-item">
    <div class="chat-msgs-item-time">{{data.created_at || data.msg_time}}</div>
    <div class="chat-msgs-item-content">
      <div class="chat-msgs-item-image"><img :src="fromImage"/></div>
      <div class="chat-msgs-item-message">{{data.message}}</div>
    </div>
  </li>`,
    props: {
      data: null,
      fromImage: null
    }
  })
  Vue.component('fromTempalte2', {
    template: `<li class="chat-msgs-item">
    <div class="chat-msgs-item-content">
      <div class="chat-msgs-item-image"><img :src="fromImage"/></div>
      <div class="chat-msgs-item-message">
        <span v-for="item in data.message">{{item}}</span>
      </div>
    </div>
  </li>`,
    props: {
      data: null,
      fromImage: null
    }
  })
  Vue.component('sytemTempalte', {
    template: `<li class="chat-msgs-item">
    <div class="chat-msgs-item-time">{{data.created_at || data.msg_time}}</div>
    <div class="chat-msgs-item-content system">[{{$t('public0.public251')}}]：{{formatSystemMessage(data.message)}}</div>
  </li>`,
    props: {
      data: null,
      fromImage: null,
      formatSystemMessage: null
    },
  })
  export default {
    props: ['value', 'orderNumber', 'switchNew', 'firstEnter'],
    data () {
      return {
        message: '',
        moveCursor: false,
        fullScreen: false,
        oldSwitchNew: this.switchNew,
        tempPos: {
          left: 0,
          // top: `${Math.max(0, window.innerHeight - 546)}px`
        },
        avatarUrl: avatar,
        datas: []
      }
    },
    computed: {
      ...mapGetters(['getApiToken', 'getUserInfo']),
      orderDatas () {
        let newDatas = []
        let oldDatas = []
        this.datas.forEach((item) => {
          if (item.hasNewMessage) {
            newDatas.push(item)
          } else {
            oldDatas.push(item)
          }
        })
        return newDatas.concat(oldDatas)
      },
      cursorStyle () {
        if (this.fullScreen) {
          return {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }
        } else {
          return this.tempPos
        }
      },
      curOrder () {
        var data = null
        for (let i = 0; i < this.datas.length; i++) {
          let d = this.datas[i]
          if (d.selected === true) {
            data = d
            break
          }
        }
        console.log(data)
        return data
      },
      isReadOnly () {
        if (this.curOrder) {
          return this.curOrder.readOnly
        } else {
          return true
        }
      },
      msgChange () {
        if (this.curOrder) {
          return {
            old: this.curOrder.oldMessages,
            new: this.curOrder.messages
          }
        } else {
          return {}
        }
      },
      isOrderNumberExsit () {
        let bool = false
        for (let i = 0; i < this.datas.length; i++) {
          let d = this.datas[i]
          if (this.orderNumber === d.order_number) {
            bool = true
            break
          }
        }
        return bool
      },
      messages () {
        if (this.curOrder) {
          let oldMsg = this.curOrder.oldMessages
          let newMsg = this.curOrder.messages
          let temp = {}
          newMsg.forEach((item) => {
            if (item.chat_info_id) {
              temp[String(item.chat_info_id)] = true
            }
          })
          for (let i = 0; i < oldMsg.length; i++) {
            let o = oldMsg[i]
            if (temp[String(o.chat_info_id)]) {
              oldMsg.splice(i, 1)
              i--
              continue
            }
          }
          console.log(newMsg)
          return oldMsg.concat(newMsg)
        } else {
          return []
        }
      }
    },
    watch: {
      getApiToken () {
        this.getList()
      },
      'msgChange' () {
        this.$nextTick(() => {
          if (this.curOrder && this.curOrder.isBottom) {
            this.$refs.content.scrollTop = this.$refs.content.scrollHeight
          }
        })
      },
      orderNumber (val) {
        if (this.isOrderNumberExsit) {
          this.switchOrder(this.orderNumber)
          return
        }
        let order = this.createOrderItem(val)
        this.datas.splice(0, 0, order)
        if (this.switchNew === this.oldSwitchNew) {
          order.hasNewMessage = true
        }
        if (this.switchNew !== this.oldSwitchNew) {
          order.readOnly = true
        }
        if (!this.order || this.switchNew !== this.oldSwitchNew || !this.value) {
          this.$emit('input', true)
          this.switchOrder(order.order_number)
        }
        this.oldSwitchNew = this.switchNew
      },
      firstEnter (val) {
        this.$nextTick(() => {
          if (val === 1) {
            this.$refs.content.scrollTop = this.$refs.content.scrollHeight
          }
        })
      }
    },
    created () {
      // this.getList()
      this.$nextTick(() => {
        this.addEvents({
          name: 'chatEvent',
          fun: this.chatEvent
        })
      })
      this.addOtcSocketEvent(this.systemEvent)
    },
    beforeDestroy () {
      this.removeEvents('chatEvent')
      this.removeOtcSocketEvent(this.systemEvent)
    },
    methods: {
      ...mapActions(['addOtcSocketEvent', 'removeOtcSocketEvent', 'addEvents', 'removeEvents']),
      formatSystemMessage: utils.formatSystemMessage,
      systemEvent (data) {
        let optType = parseInt(data.operate_type)
        let childType = parseInt(data.child_type)
        if (optType === 1) { // 系统消息
          switch (childType) {
            case 32: // 取消订单消息
            case 33: // 系统自动取消订单消息
            case 35: // 正常放币消息
            case 36: // 强制放币买家消息
            case 37: // 强制放币卖家消息
            case 38: // 解除锁币消息
              // 禁止发送消息
              for (let i = 0; i < this.datas.length; i++) {
                let d = this.datas[i]
                if (d.order_number === JSON.parse(data.link).order_number) {
                  d.readOnly = true
                  break
                }
              }
              break
          }
          // 生成系统消息
          this.createSystemInfo(data)
        } else if (optType === 2) { // 聊天消息
          this.$emit('markNewMsg', true)
          let isExist = false
          for (let i = 0; i < this.datas.length; i++) {
            let item = this.datas[i]
            if (item.order_number === data.order_number) {
              isExist = true
              item.hasNewMessage = true
              item.messages.push(data)
            }
          }
          if (!isExist) {
            let order = this.checkOrderNumber(data.order_number)
            order.hasNewMessage = true
            order.messages.push(data)
          }
        }
      },
      chatEvent (res) {
        if (res && res.type === 'markReadOnly') {
          this.markReadOnly(res.orderNumber)
        }
      },
      markReadOnly (orderNumber) {
        for (let i = 0; i < this.datas.length; i++) {
          let d = this.datas[i]
          if (d.order_number === orderNumber) {
            d.readOnly = true
            break
          }
        }
      },
      switchOrder (orderNumber) {
        this.datas.forEach((item) => {
          if (orderNumber === item.order_number) {
            item.selected = true
          } else {
            item.selected = false
          }
        })
        this.getMessages(this.curOrder)
      },
      createOrderItem (orderNumber) {
        return {
          order_number: orderNumber,
          hasNewMessage: false,
          selected: false,
          user_header: null,
          opposite_user_header: null,
          opposite_user_name: null,
          opposite_real_name: null,
          isBottom: true,
          oldLoaded: false,
          readOnly: false,
          oldMessages: [],
          messages: []
        }
      },
      checkOrderNumber (orderNumber) { // 检测
        let order = null
        for (let i = 0; i < this.datas.length; i++) {
          let item = this.datas[i]
          if (item.order_number === orderNumber) {
            order = item
            break
          }
        }
        if (!order) {
          order = this.createOrderItem(orderNumber)
          this.datas.splice(0, 0, order)
          if (!this.curOrder) {
            this.switchOrder(orderNumber)
          }
        }
        return order
      },
      getList () {
        if (!this.getApiToken) {
          return
        }

        otcApi.getOrdersList({ // 获取未完成订单列表，生成聊天列表
          state: 1
        }, (res) => {
          res.forEach((item) => {
            this.datas.push(this.createOrderItem(item.order_number))
          })
          if (this.datas.length) {
            this.datas[0].selected = true
            this.getMessages(this.datas[0])
          }
        })
      },
      createSystemInfo (data) { // 系统消息
        if (data.type !== 3) {
          return
        }
        let showChat = this.value
        this.$emit('markNewMsg', true)
        let linkObj = JSON.parse(data.link)
        let orderNumber = linkObj.order_number
        let order = this.checkOrderNumber(orderNumber)
        order.hasNewMessage = true
        order.messages.push({
          isSystem: true,
          chat_info_id: data.chat_info_id,
          created_at: (new Date()).format(),
          order_number: orderNumber,
          message: data.title
        })
        if (!showChat) {
          this.switchOrder(orderNumber)
        }
      },
      getMessages (data) { // 获取聊天信息
        if (!this.getApiToken) {
          return
        }
        if (data.oldLoaded) {
          return
        }
        // 根据订单编号获取对应的广告信息
        otcApi.getAdByOrderNumber(data.order_number, (res) => {
          if (res.remark && String(res.from_user_id) !== String(this.getUserInfo.userId)) {
            data.oldMessages.splice(0, 0, {
              isRemark: true,
              created_at: res.created_at,
              message: res.remark.split('\n'),
              order_number: data.order_number,
              user_id: res.from_user_id
            })
          }
        })
        // 根据订单编号获取对应的聊天信息
        otcApi.getMessagesByOrderNumber({
          order_number: data.order_number
        }, (res) => {
          data.user_header = res.user_header
          data.opposite_user_header = res.opposite_user_header
          data.opposite_user_name = res.opposite_user_name
          data.opposite_real_name = res.opposite_real_name
          data.oldLoaded = true
          res.chat_info.forEach((item) => {
            console.log(item)
            data.oldMessages.push(item)
          })
        })
      },
      getTemplate (item) { // 获取模板
        if (item.is_system && parseInt(item.is_system) === 1) {
          if ((String(item.user_id) === String(this.getUserInfo.userId)) || item.message === 'OTC_NEW_ORDER') {
            return `sytemTempalte`
          } else {
            return null
          }
        }
        if (item.isSystem) {
          return `sytemTempalte`
        } else if (item.isRemark) {
          return `fromTempalte2`
        }
        if (String(item.user_id) === String(this.getUserInfo.userId)) {
          return `selfTemplate`
        } else {
          return `fromTempalte`
        }
      },
      sendMessage () { // 发送信息
        if (this.isReadOnly) {
          return
        }

        if (!this.curOrder) {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`public0.public141`)}) // 暂无订单
          return
        }
        if (!this.message) {
          Vue.$koallTipBox({id: 'sendNullMessage', icon: 'notification', message: this.$t(`public0.public250`)}) // 请输入内容
          return
        }
        let data = {
          created_at: (new Date()).format(),
          order_number: this.curOrder.order_number,
          user_id: this.getUserInfo.userId,
          message: this.message
        }
        this.curOrder.messages.push(data)
        otcApi.sendMessage({
          order_number: this.curOrder.order_number,
          message: this.message
        })
        this.message = ''
      },
      mouseDown (e) { // 拖动窗口
        if (this.fullScreen) {
          return
        }
        let left = this.$refs.chat.offsetLeft
        let top = this.$refs.chat.offsetTop
        let startX = e.pageX
        let startY = e.pageY
        let self = this
        let wWidth = window.innerWidth
        let wHeight = window.innerHeight
        let width = this.$refs.chat.clientWidth
        let height = this.$refs.chat.clientHeight
        let maxLeft = wWidth - width
        let maxTop = wHeight - height

        function mm (ev) {
          ev.preventDefault()
          self.moveCursor = true
          self.tempPos = {
            left: `${Math.min(Math.max(0, left + ev.pageX - startX), maxLeft)}px`,
            top: `${Math.min(Math.max(0, top + ev.pageY - startY), maxTop)}px`
          }
          self.$refs.chat.style.left = self.tempPos.left
          self.$refs.chat.style.top = self.tempPos.top
        }

        function mp (ev) {
          ev.preventDefault()
          self.moveCursor = false
          document.removeEventListener('mousemove', mm, false)
          document.removeEventListener('mouseup', mp, false)
        }

        document.addEventListener('mousemove', mm, false)
        document.addEventListener('mouseup', mp, false)
      },
      mouseWheel (e, type) {
        if (type === 1) {
          this.$refs.orders.scrollTop += e.wheelDelta > 0 ? -75 : 75
        } else {
          this.$refs.content.scrollTop += e.wheelDelta > 0 ? -75 : 75
        }
        e.preventDefault()
      },
      markRead () { // 标记已读
        this.$emit('markNewMsg', false)
        if (this.curOrder) {
          this.curOrder.hasNewMessage = false
        }
      },
      closeChat () { // 关闭窗口
        this.$emit('input', false)
      },
      addSystemMessage (orderNumber, message) { // 添加系统消息
        this.$emit('markNewMsg', true)
        for (let i = 0; i < this.datas.length; i++) {
          let d = this.datas[i]
          if (d.order_number === orderNumber) {
            d.hasNewMessage = true
            d.messages.push({
              isSystem: true,
              created_at: (new Date()).format(),
              order_number: orderNumber,
              message: message
            })
            break
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .chat {
    /*display: flex;*/
    /*flex-flow: column;*/
    /*margin-top: 20px;*/
    position: relative;
    height: 100%;
    top: 0;
    left: 0;
    width: 100%;
  }


  .chat-title {
  }

  .chat-body {
    display: flex;
    flex: 1;
    margin-top: 15px;
    min-height: 300px;
    max-height: 500px;
    overflow: auto;
    background-color: #F6F6F6;
    border-radius: 4px;
    position: absolute;
    height: calc(~'100% - 100px');
    width: 100%;
    top: 30px;
    left: 0;
  }


  .chat-body-right {
    display: flex;
    flex: 1;
    flex-flow: column;
  }

  .chat-body-right-content {
    display: flex;
    flex: 1;
    padding: 15px 14px;
    overflow: auto;
  }

  .chat-body-right-content::-webkit-scrollbar { /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .chat-body-right-content::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #f0f0f0;
  }

  .chat-body-right-content::-webkit-scrollbar-track { /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
    border-radius: 3px;
    background: #F6F6F6;
  }

  .chat-msgs-list {
    width: 100%;
  }

  .chat-msgs-item {
    display: flex;
    flex-flow: column;
    height: auto;
    margin-bottom: 10px;
    word-break: break-all;
  }

  .chat-msgs-item /deep/ .chat-msgs-item-time {
    color: #999;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    margin-bottom: 4px;
  }

  .chat-msgs-item /deep/ .chat-msgs-item-content {
    display: flex;
    flex: 1;
  }

  .chat-msgs-item /deep/ .chat-msgs-item-content.right {
    justify-content: flex-end;
  }

  .chat-msgs-item /deep/ .chat-msgs-item-image {
    width: 32px;
    height: 32px;
    border: 1px solid #eee;
    background-color: #eee;
    border-radius: 50%;
    overflow: hidden;
  }

  .chat-msgs-item /deep/ .chat-msgs-item-message {
    max-width: 66.6%;
    padding: 10px 15px;
    background-color: #fff;
    color: #333;
    font-size: 16px;
    border-radius: 4px;
    margin: 0 8px;
    word-break: break-word;
    align-self: center;
    display: flex;
    flex-flow: column;
  }

  .chat-msgs-item /deep/ .self {
    background-color: #fff;
  }

  .chat-msgs-item /deep/ .system {
    color: #F0B936;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    font-size: 16px;
  }

  .chat-msgs-item /deep/ img {
    width: 100%;
    height: 100%;
  }

  .chat-body-right-send {
    margin-top: 10px;
    border-radius: 4px;
    display: flex;
    height: 50px;
    background-color: #F6F6F6;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .send-container {
    display: flex;
    width: calc(100% - 14px);
    height: 36px;
  }

  .send-input {
    width: calc(100% - 12px);
    padding: 0 10px;
    color: #666;
    font-size: 16px;
  }

  .send-input::-webkit-input-placeholder {
    color: #7E7E7E;
    font-size: 16px;
  }

  .send-input[readonly='readonly'] {
    cursor: not-allowed;
  }

  .send-btn {
    width: 120px;
    background-color: #F0B936;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
  }

  .send-btn:hover {
    background-color: #e8a400;
  }

  .send-btn.disabled {
    background-color: #999;
    cursor: not-allowed;
  }
</style>
