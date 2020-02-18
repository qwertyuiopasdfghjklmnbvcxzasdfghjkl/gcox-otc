<template>
  <div class="cont">
    <h4>{{$t('usercontent.user96').format(symbol) }}</h4>
    <div class="inp">
      <label>
        <p>{{$t('usercontent.user88')}}</p>
        <input v-model="address" data-vv-name="address" v-validate="'required'"/>
        <p v-if="errors.has('address')" class="error">{{$t('usercontent.user99')}}</p>
      </label>
      <label>
        <p>{{$t('usercontent.user89')}}</p>
        <input v-model="memo" data-vv-name="memo" v-validate="'required'" maxlength="50"/>
        <p v-if="errors.has('memo')" class="error">{{$t('usercontent.user98')}}</p>
      </label>
      <label>
        <p>{{$t('usercontent.user61')}}</p>
        <input v-model="googleCode" data-vv-name="googleCode" v-validate="'required'"/>
        <p v-if="errors.has('googleCode')" class="error">{{$t('usercontent.user33')}}</p>
      </label>
    </div>
    <div class="btn">
      <button @click="close()">{{$t('usercontent.user31')}}</button>
      <button @click="add()" class="active">{{$t('usercontent.user32')}}</button>
    </div>
    <loading v-if="showLoading" class="load"></loading>
  </div>
</template>

<script>
  import Vue from 'vue'
  import wallrtApi from '../../api/wallet'
  import Loading from '../../components/ajaxLoading/loading'

  export default {
    name: 'addSymbol',
    components: {Loading},
    props: ['symbol'],
    data () {
      return {
        address: null,
        memo: null,
        googleCode: null,
        addressError: false,
        memoError: false,
        googleCodeError: false,
        showLoading: false,
        lock: true
      }
    },
    methods: {
      blur (e, er) {
        this[er] = !this[e]
      },
      close () {
        this.$emit('removeDialog')
      },
      add () {
        let validData = {
          address: this.address,
          memo: this.memo,
          googleCode: this.googleCode
        }
        this.$validator.validateAll(validData).then((validResult) => {
          if (validResult) {
            this.showLoading = true
            let data = {
              symbol: this.symbol,
              address: this.address,
              memo: this.memo,
              googleCode: this.googleCode
            }
            wallrtApi.addAddress(data, res => {
              this.showLoading = false
              this.$emit('okCallback', data)
              this.close()
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
            }, msg => {
              this.showLoading = false
              Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    width: 600px;
    color: #606266;
    font-size: 14px;
    background: #fff;
    position: relative;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    h4{
      border-bottom: 1px solid #ededed;
      padding: 15px 20px;
    }

    .inp {
      padding-top: 30px;
      margin: 0 auto;

      label {
        position: relative;
        display: flex;
        margin: 18px auto;
        justify-content: flex-start;
        align-items: center;
        p {
          display: inline-block;
          width: 160px;
          text-align: right;
          padding-right: 15px;
        }

        input {
          background: #eeeeee;
          height: 34px;
          line-height: 30px;
          width: 300px;
          padding-left: 10px;
          border-radius:4px;
        }

        .error {
          position: absolute;
          top: 8px;
          left: 185px;
          color: #f1304a;
          width: 300px;
          text-align: left;
          z-index: 99;
        }
      }
    }

    .btn {
      display: flex;
      justify-content: center;
      margin: 40px auto;

      button {
        padding: 4px 20px;
        min-width: 100px;
        cursor: pointer;
        background: none;
        background: #eeeeee;
        color: #666666;
        border-radius:4px;

        &.active {
          background: #F0B936;
          line-height: 28px;
          color: #ffffff;
          margin-left: 40px;
          cursor: pointer;
        }
      }
    }
  }

  .load {
    position: fixed;
    top: 45%;
    left: 50%;
    margin-left: -25px;
    z-index: 9999;
  }
</style>
