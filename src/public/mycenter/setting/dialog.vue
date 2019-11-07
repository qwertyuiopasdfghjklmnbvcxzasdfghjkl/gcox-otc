<template>
  <Card style="width: 800px">
    <p slot="title">
      {{vm.$t('gcox_otc.add_bankcard')}}
      <span @click="closeDialog" class="icon-close"></span>
    </p>
    <form class="form-col" ref="bankForm" data-vv-scope="bank_scope">
      <ul class="form-table">
        <li class="form-row">
          <label class="form-label">{{vm.$t('otc_legal.otc_legal_Name')}}<!--姓名--><em
            class="asterisk">&nbsp;*</em></label>
          <input class="form-input" type="text" name="card_name" v-model="bankData.card_name"/>
        </li>
        <li class="form-row">
          <label class="form-label">{{vm.$t('otc_legal.otc_legal_Bank')}}<!--开户行--><em
            class="asterisk">&nbsp;*</em></label>
          <div class="input_div">
            <input class="form-input" :class="{error: errors.has('bank_scope.card_bank')}" type="text" name="card_bank"
                   v-model="bankData.card_bank" v-validate="'required'" maxlength="32"/>
            <span class="form-error" v-if="errors.has('bank_scope.card_bank')">{{msgs.card_bank[errors.firstRule('card_bank')]}}</span>
          </div>

        </li>
        <li class="form-row">
          <label class="form-label">{{vm.$t('otc_legal.otc_legal_Bank_number')}}<!--银行卡号--><em
            class="asterisk">&nbsp;*</em></label>
          <div class="input_div">
            <input class="form-input" :class="{error: errors.has('bank_scope.card_number')}" type="text"
                   name="card_number" v-model="bankData.card_number" v-validate="'required|bankCardValid'"
                   maxlength="32"/>
            <span class="form-error" v-if="errors.has('bank_scope.card_number')">{{msgs.card_number[errors.firstRule('card_number')]}}</span>
          </div>

        </li>
        <li class="form-row form-row-bottom">
          <button class="form-save green_button" @click="saveSettings">{{vm.$t('otc_legal.otc_legal_save')}}</button>
          <!--保存-->
        </li>
      </ul>
    </form>
  </Card>
</template>

<script>
  import Vue from 'vue'
  import Card from '../../../components/card'
  import otcApi from '@/api/otc'

  export default {
    name: 'dilog',
    components: {Card},
    props: ['item', 'list'],
    data () {
      const vm = window.vm
      return {
        vm: vm,
        bankData: {},
        status: true
      }
    },
    computed: {
      msgs () {
        return {
          card_bank: {required: this.vm.$t('otc_legal.otc_legal_input_bank')}, // 请输入开户行
          card_number: {
            required: this.vm.$t('otc_legal.otc_legal_input_bank_number'),
            bankCardValid: this.vm.$t('public0.public135')
          }, // 请输入银行卡号、请输入有效的银行卡号
          wechat_number: {required: this.vm.$t('otc_legal.otc_legal_input_WeChat_number')}, // 请输入微信账号
          wechat_QRcode: {required: this.vm.$t('public0.public90')}, // 未选择文件
          alipay_number: {required: this.vm.$t('otc_legal.otc_legal_input_Alipay_number')}, // 请输入支付宝账号
          alipay_QRcode: {required: this.vm.$t('public0.public90')}, // 未选择文件
          paypal_number: {required: this.vm.$t('public0.public222')} // 请输入PayPal账号
        }
      }
    },
    created () {
      if (this.item) {
        this.bankData = this.item
      }
    },
    methods: {
      closeDialog () {
        this.$emit('removeDialog')
      },
      saveSettings (event) {
        event.preventDefault() || (event.returnValue = false)
        this.list.filter(res => {
          if (res.card_number === this.bankData.card_number) {
            Vue.$koallTipBox({icon: 'notification', message: this.$t('gcox_otc.card_repetition')})
            this.status = false
          }
        })
        if (this.status) {
          let formData = new FormData(this.$refs.bankForm)
          this.status = false
          otcApi.savePaySettings(1, formData, res => {
            this.status = true
            Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${res}`)})
            this.$emit('okCallback')
            this.$emit('removeDialog')
          }, msg => {
            this.status = true
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .form-table {
    li {
      padding: 10px;
      display: flex;
      align-items: center;

      label {
        width: 100px;
      }

      .input_div {
        flex: 1;

        input {
          display: block;
          width: calc(~'100% - 20px');
        }
      }

      input {
        flex: 1;
        padding: 10px;
        border: 1px solid #eeeeee;
      }

      .form-error {
        color: #e74c3c;
      }

      .form-save {
        padding: 10px 20px;
        color: #ffffff;
        margin: 10px auto;
        width: 120px;
      }
    }
  }
</style>
