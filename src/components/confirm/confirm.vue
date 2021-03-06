<template>
  <div :id="id" class="dialog" :style="dialogStyle">
    <div class="top" v-if="title">{{title}}</div>
    <div class="form">
      <div class="content cont_text" v-if="!isComponent" :style="`font-weight:${fontWeight};color:${color};`">
        <template v-if="(content||'').constructor !== Array">
          <p v-html="content"></p>
        </template>
        <template v-if="(content||'').constructor === Array">
          <div v-for="(item,i) in content" :key="i">
            <p v-html="item"></p>
          </div>
        </template>
      </div>
      <div class="content" v-if="isComponent">
        <mycomponent :item="item" :is="content"></mycomponent>
      </div>
      <div class="buttons" :class="[`buttons-${btnPosition}`]">
        <input v-if="showCancel" class="button cancel" type="button" :value="cancelTitle" @click="closeDialog"/>
        <input class="button" type="button" :value="$t('exchange.exchange_determine')" @click="ok"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      id: null,
      title: {
        type: String
      },
      width: {
        type: Number,
        default: 370
      },
      height: {
        type: Number
      },
      minHeight: {
        type: Number,
        default: 100
      },
      fontWeight: {
        type: String,
        default: 'normal'
      },
      color: {
        type: String,
        default: '#261003'
      },
      content: null,
      autoClose: {
        type: Boolean,
        default: false
      },
      delayTime: {
        type: Number,
        default: 10
      },
      btnPosition: {
        type: String,
        default: 'center'
      },
      isComponent: {
        type: Boolean,
        default: false
      },
      showCancel: {
        type: Boolean,
        default: true
      },
      item: null,
      tempIds: {}
    },
    data () {
      return {
        interval: null,
        lastTime: this.delayTime
      }
    },
    computed: {
      cancelTitle () {
        if (this.autoClose === false) {
          return this.$t('otc_legal.otc_legal_cancel')
        }
        return `${this.$t('otc_legal.otc_legal_cancel')}(${this.lastTime}s)`
      },
      dialogStyle () {
        return {
          width: `${this.width}px`,
          height: this.height ? `${this.height}px` : `auto`,
          'min-height': `${this.minHeight}px`
        }
      }
    },
    created () {
      this.$nextTick(() => {
        if (this.autoClose) {
          this.interval = setInterval(() => {
            if (this.lastTime === 1) {
              clearInterval(this.interval)
              this.closeDialog()
              return
            }
            this.lastTime -= 1
          }, 1000)
        }
      })
    },
    beforeDestroy () {
      clearInterval(this.interval)
    },
    methods: {
      closeDialog () {
        this.id && (delete this.tempIds[this.id])
        if (this.$parent) {
          this.$parent.$emit('removeDialog')
        } else {
          this.$emit('removeDialog')
        }
      },
      ok () {
        this.id && (delete this.tempIds[this.id])
        if (this.$parent) {
          this.$parent.$emit('okCallback')
          this.$parent.$emit('removeDialog')
        } else {
          this.$emit('okCallback')
          this.$emit('removeDialog')
        }
      }
    }
  }
</script>

<style scoped>
  .dialog {
    display: flex;
    flex-flow: column;
    background-color: #fff;
    overflow: hidden;
    border-radius: 6px;
  }

  .top {
    width: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
    position: relative;
    background-color: #1f1e24;
    justify-content: center;
    align-items: center;
    display: flex;
    color: #fff;
    font-size: 18px;
  }

  .form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    padding: 30px;
  }

  .content {
    color: #261003;
    font-size: 16px;
    word-wrap: break-word;
    word-break: normal;

  }
.cont_text{
  background: #eeeeee;
  padding: 15px;
  width: 100%;
  text-align: center;
}
  .buttons {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }

  .buttons-center {
    align-self: center;
  }

  .buttons-right {
    align-self: flex-end;
  }

  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 90px;
    height: 35px;
    line-height: 35px;
    color: #fff;
    background-color: #f0b936;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .button:hover {
    background-color: #e4bc29;
  }

  .button.cancel {
    margin-right: 10px;
    color: #261003;
    background-color: transparent;
    border: 1px solid #ccc;
  }

  .button.cancel:hover {
    color: #261003;
    border-color: #bbb;
  }
</style>
