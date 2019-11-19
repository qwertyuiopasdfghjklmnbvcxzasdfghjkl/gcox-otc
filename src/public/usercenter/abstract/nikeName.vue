<template>
  <card style="width:750px;">
    <p slot="title">
      <span>{{$t('public0.public40')}}</span>
      <i @click="close()"><img width="14" src="../../../assets/img/close.png"/></i>
    </p>
    <div class="cont">
      <div class="step">
        <div class="box">
          <input :placeholder="$t('public0.public73')" maxlength="15" type="text" v-model="nikeName"/>
        </div>
        <em class="error">
          {{$t('account.user_center_set_username')}}
        </em>
        <p class="btn">
          <button class="yellow_button" @click="sub()">{{$t('account.user_center_change')}}</button>
        </p>
      </div>
    </div>
  </card>
</template>

<script>
  import user from '../../../api/individual'
  import Card from '../../../components/card'
  import Vue from 'vue'

  export default {
    name: 'nikeName',
    components: {Card},
    data () {
      return {
        nikeName: null,
        status: false
      }
    },
    created () {

    },
    methods: {
      sub () {
        if (this.nikeName) {
          if (!this.status) {
            this.status = true
            let data = {
              nickname: this.nikeName
            }
            user.editNickname(data, res => {
              Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${res}`)})
              this.$emit('okCallback')
              this.close()
            }, msg => {
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
            })
          }
        } else {
          Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public73')})
        }
      },
      close () {
        this.$emit('removeDialog')
      },
    }
  }
</script>

<style scoped lang="less">
  .box {
    height: 30px;
    border: 1px solid #eeeeee;
    line-height: 30px;
    padding: 10px;
    margin: 10px 0;
    display: flex;

    input {
      flex: 1;
    }
  }

  .btn {
    text-align: center;

    button {
      cursor: pointer;
    }
  }
</style>
