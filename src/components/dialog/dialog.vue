<template>
  <div :id="id" ref="dialog" class="koall-dialog"> <!-- :style="modelStyle" -->
      <div class="modal-mask" 
      :class="['animated',{'maskShow':class_show,'maskHide':class_hide}]"
      ></div>
      
    <div ref="modalWp" class="modal-wrap"
    @click.self="setBackClose"
    :class="['animated',{'modalShow':class_show,'modalHide':class_hide}]"
    ></div>
  </div>
</template>

<script>
  export default {
    props: {
      id: null,
      backClose:{
        type:Boolean,
        default: false
      },
      model: {
        type: Boolean,
        default: true
      },

      component: null
    },
    data(){
      return {
        class_show:false,
        class_hide:false,
      }
    },
    computed: {
      modelStyle () {
        let style = {}
        this.model && (style['background-color'] = 'rgba(0, 0, 0, 0.5)')
        return style
      }
    },
    created () {
      this.$nextTick(() => {
        this.component && this.component.$el && this.$refs.modalWp.appendChild(this.component.$el)
        this.class_show = true;
      })
    },
    methods: {
      removeDialog () {
        if (!this.$refs.dialog.parentNode) {
          return
        }
        this.class_show = false;
        this.class_hide = true;
        this.component.$destroy()
        let dialog = this.$refs.dialog
        setTimeout(() => {
            this.$destroy()
            document.body.removeChild(dialog)
        }, 300);
      },
      setBackClose(){
        if(this.backClose){
          this.removeDialog()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.koall-dialog{
  width:100%;
  height:100%;
  z-index:1002;
  position:fixed;
  top:0;
  left:0;
  .modal-mask{
    position: fixed;
    z-index: 1000;
    top:0;
    left:0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-color: rgba(55,55,55,.6);
    opacity: 0;
    animation-timing-function: linear;

  }
  .modal-wrap{
    z-index: 1003!important;
    position: fixed;
    top:0;
    left:0;
    right: 0;
    bottom: 0;
    display:flex;
    justify-content:center;
    align-items:center;
    transform:scale(.9);
    animation-timing-function: cubic-bezier(.42, .15, .85, 1);
    .ivu-select-dropdown{
      position: absolute !important;
    }

  }
  .animated {
    -webkit-animation-duration: .2s;
    -moz-animation-duration: .2s;
    -o-animation-duration: .2s;
    animation-duration: .2s;
    -webkit-animation-fill-mode: both;
    -moz-animation-fill-mode: both;
    -o-animation-fill-mode: both;
    animation-fill-mode: both;
    opacity: 0;
  }
  
  @-webkit-keyframes maskShow {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes maskShow {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .animated.maskShow {
    -webkit-animation-name: maskShow;
    -moz-animation-name: maskShow;
    -o-animation-name: maskShow;
    animation-name: maskShow;
  }
  @-webkit-keyframes maskHide {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes maskHide {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .animated.maskHide {
    -webkit-animation-name: maskHide;
    -moz-animation-name: maskHide;
    -o-animation-name: maskHide;
    animation-name: maskHide;
  }
  @-webkit-keyframes modalShow {
    0% {
      opacity: 0;
      transform:scale(.9);  
    }
    100% {
      opacity: 1;
      transform:scale(1);  
    }
  }
  @keyframes modalShow {
    0% {
      opacity: 0;
      transform:scale(.9);  
    }
    100% {
      opacity: 1;
      transform:scale(1); 
    }
  }
  .animated.modalShow {
    -webkit-animation-name: modalShow;
    -moz-animation-name: modalShow;
    -o-animation-name: modalShow;
    animation-name: modalShow;
  }
  @-webkit-keyframes modalHide {
    0% {
      opacity: 1;
      transform:scale(1);  
    }
    100% {
      opacity: 0;
      transform:scale(.9);  
    }
  }
  @keyframes modalHide {
    0% {
      opacity: 1;
      transform:scale(1);  
    }
    100% {
      opacity: 0;
      transform:scale(.9);  
    }
  }
  .animated.modalHide {
    -webkit-animation-name: modalHide;
    -moz-animation-name: modalHide;
    -o-animation-name: modalHide;
    animation-name: modalHide;
  }
}
</style>

