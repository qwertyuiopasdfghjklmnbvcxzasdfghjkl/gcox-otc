<template>
  <div class="w1200 settings">
    <h3> {{$t('otc_legal.otc_legal_Bank_Transfer')}}<!--银行转账--></h3>
    <ul class="list">
      <!-- 银行卡 -->
      <li class="form-item" v-if="bankList.length" v-for="item in bankList">
        <div class="form-flex">
          <div class="form-flex-left">
            <i class="icon-bank"></i>
            <em>{{$t('otc_legal.oyc_legal_Bank_card')}}<!--银行卡--></em>
          </div>
          <div class="form-flex-center">
            <div class="have-set">
              <p class="card_name">{{$t('otc_legal.otc_legal_Name')}}：<!--姓名--> {{item.card_name}}</p>
              <p class="card_bank">{{$t('otc_legal.otc_legal_Bank')}}：<!--开户行--> {{item.card_bank}}</p>
              <p class="card_number">{{$t('otc_legal.otc_legal_Bank_number')}}：<!--银行卡号--> {{item.card_number}}</p>
            </div>
          </div>
          <div class="form-flex-right">
            <span class="yellow_button" @click="update(item)">{{$t('gcox_otc.update')}}<!--修改--></span>
            <span class="red_button" @click="del(item.card_number)">{{$t('gcox_otc.delete')}}<!--删除--></span>
          </div>
        </div>
      </li>
      <li class="add_li" @click="add()"><img src="../../assets/img/add.png"/>{{$t('gcox_otc.add_bankcard')}}</li>
    </ul>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import otcApi from '@/api/otc'
  import utils from '@/assets/js/utils'
  import config from '@/assets/js/config'
  import dialog from './setting/dialog'

  export default {
    data () {
      return {
        infoLoaded: false,
        bankReadOnly: true,
        delStatus: true,
        bankData: {
          card_name: '',
          card_bank: '',
          card_number: ''
        },
        oldBankData: {
          card_name: '',
          card_bank: '',
          card_number: ''
        },
        wechatReadOnly: true,
        wechatData: {
          wechat_name: '',
          wechat_number: '',
          wechat_QRcode: ''
        },
        oldWechatData: {
          wechat_name: '',
          wechat_number: '',
          wechat_QRcode: ''
        },
        alipayReadOnly: true,
        alipayData: {
          alipay_name: '',
          alipay_number: '',
          alipay_QRcode: ''
        },
        oldAlipayData: {
          alipay_name: '',
          alipay_number: '',
          alipay_QRcode: ''
        },
        paypalReadOnly: true,
        paypalData: {
          paypal_name: '',
          paypal_number: ''
        },
        oldPayPalData: {
          paypal_name: '',
          paypal_number: ''
        },
        isShowUpload: {
          wechat_QRcode: true,
          alipay_QRcode: true
        },
        isSaveSettings: false,
        bankList: []
      }
    },
    computed: {
      ...mapGetters(['getUserInfo']),
      msgs () {
        return {
          card_bank: {required: this.$t('otc_legal.otc_legal_input_bank')}, // 请输入开户行
          card_number: {
            required: this.$t('otc_legal.otc_legal_input_bank_number'),
            bankCardValid: this.$t('public0.public135')
          }, // 请输入银行卡号、请输入有效的银行卡号
          wechat_number: {required: this.$t('otc_legal.otc_legal_input_WeChat_number')}, // 请输入微信账号
          wechat_QRcode: {required: this.$t('public0.public90')}, // 未选择文件
          alipay_number: {required: this.$t('otc_legal.otc_legal_input_Alipay_number')}, // 请输入支付宝账号
          alipay_QRcode: {required: this.$t('public0.public90')}, // 未选择文件
          paypal_number: {required: this.$t('public0.public222')} // 请输入PayPal账号
        }
      }
    },
    watch: {
      // bankReadOnly (newVal) {
      //   if (newVal) {
      //     if (this.isSaveSettings) {
      //       this.oldBankData = JSON.parse(JSON.stringify(this.bankData))
      //       this.isSaveSettings = false
      //     } else {
      //       this.bankData = JSON.parse(JSON.stringify(this.oldBankData))
      //     }
      //   }
      // },
      // wechatReadOnly (newVal) {
      //   if (newVal) {
      //     if (this.isSaveSettings) {
      //       this.oldWechatData = JSON.parse(JSON.stringify(this.wechatData))
      //       this.isSaveSettings = false
      //     } else {
      //       this.wechatData = JSON.parse(JSON.stringify(this.oldWechatData))
      //       this.$refs.wechatForm.querySelector('input[name="source"]').value = null
      //     }
      //   }
      // },
      // alipayReadOnly (newVal) {
      //   if (newVal) {
      //     if (this.isSaveSettings) {
      //       this.oldAlipayData = JSON.parse(JSON.stringify(this.alipayData))
      //       this.isSaveSettings = false
      //     } else {
      //       this.alipayData = JSON.parse(JSON.stringify(this.oldAlipayData))
      //       this.$refs.alipayForm.querySelector('input[name="source"]').value = null
      //     }
      //   }
      // },
      // paypalReadOnly (newVal) { // PayPal
      //   if (newVal) {
      //     if (this.isSaveSettings) {
      //       this.oldPayPalData = JSON.parse(JSON.stringify(this.paypalData))
      //       this.isSaveSettings = false
      //     } else {
      //       this.paypalData = JSON.parse(JSON.stringify(this.oldPayPalData))
      //     }
      //   }
      // }
    },
    created () {
      this.getList()
    },
    methods: {
      // loadData () {
      //   otcApi.getPaySettings((res) => {
      //     // 银行卡
      //     this.bankData = {
      //       card_name: res.data.card_name,
      //       card_bank: res.data.card_bank,
      //       card_number: res.data.card_number
      //     }
      //     this.oldBankData = {
      //       card_name: res.data.card_name,
      //       card_bank: res.data.card_bank,
      //       card_number: res.data.card_number
      //     }
      //     // 支付宝
      //     this.alipayData = {
      //       alipay_name: res.real_name,
      //       alipay_number: res.data.alipay_number,
      //       alipay_QRcode: res.data.alipay_image_path
      //     }
      //     this.oldAlipayData = {
      //       alipay_name: res.real_name,
      //       alipay_number: res.data.alipay_number,
      //       alipay_QRcode: res.data.alipay_image_path
      //     }
      //     // 微信
      //     this.wechatData = {
      //       wechat_name: res.real_name,
      //       wechat_number: res.data.wechat_number,
      //       wechat_QRcode: res.data.wechat_image_path
      //     }
      //     this.oldWechatData = {
      //       wechat_name: res.real_name,
      //       wechat_number: res.data.wechat_number,
      //       wechat_QRcode: res.data.wechat_image_path
      //     }
      //     // PayPal
      //     this.paypalData = {
      //       paypal_name: res.real_name,
      //       paypal_number: res.data.paypal_number
      //     }
      //     this.oldPayPalData = {
      //       paypal_name: res.real_name,
      //       paypal_number: res.data.paypal_number
      //     }
      //     this.infoLoaded = true
      //   }, (res) => {
      //     if (res.msg === 'NO_PAY_TYPE') {
      //       // 银行卡
      //       this.bankData.card_name = res.real_name
      //       this.oldBankData.card_name = res.real_name
      //       // 支付宝
      //       this.alipayData.alipay_name = res.real_name
      //       this.oldAlipayData.alipay_name = res.real_name
      //       // 微信
      //       this.wechatData.wechat_name = res.real_name
      //       this.oldWechatData.wechat_name = res.real_name
      //       // PayPal
      //       this.paypalData.paypal_name = res.real_name
      //       this.oldPayPalData.paypal_name = res.real_name
      //     } else {
      //       console.error(res.msg)
      //     }
      //     this.infoLoaded = true
      //   })
      // },
      // saveSettings (type) {
      //   let scope = null
      //   let formData = null
      //   switch (type) {
      //     case 1:
      //       scope = 'bank_scope'
      //       formData = new FormData(this.$refs.bankForm)
      //       break
      //     case 2:
      //       scope = 'alipay_scope'
      //       formData = new FormData(this.$refs.alipayForm)
      //       break
      //     case 3:
      //       scope = 'wechat_scope'
      //       formData = new FormData(this.$refs.wechatForm)
      //       break
      //     case 4:
      //       scope = 'paypal_scope'
      //       formData = new FormData(this.$refs.paypalForm)
      //       break
      //   }
      //   this.$validator.validateAll(scope).then((validResult) => {
      //     if (!validResult) {
      //       return
      //     }
      //     otcApi.savePaySettings(type, formData, (msg) => {
      //       this.isSaveSettings = true
      //       switch (type) {
      //         case 1:
      //           this.bankReadOnly = true
      //           break
      //         case 2:
      //           this.alipayReadOnly = true
      //           break
      //         case 3:
      //           this.wechatReadOnly = true
      //           break
      //         case 4:
      //           this.paypalReadOnly = true
      //           break
      //       }
      //       Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.${msg}`)})
      //     }, (msg) => {
      //       Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
      //     })
      //   })
      // },
      // uploadImage (event, type) {
      //   let objectName = null
      //   let propertyName = null
      //   if (type === 2) {
      //     objectName = 'alipayData'
      //     propertyName = 'alipay_QRcode'
      //   } else if (type === 3) {
      //     objectName = 'wechatData'
      //     propertyName = 'wechat_QRcode'
      //   } else {
      //     return
      //   }
      //
      //   let isTrue = false
      //   if (config.imageType.test(event.target.value)) {
      //     isTrue = utils.limitUploadImage(event.target, (msg) => {
      //       Vue.$koallTipBox({icon: 'notification', message: this.$t(msg)}) // 图片不能超过1M
      //     }, 1)
      //   } else {
      //     isTrue = false
      //     Vue.$koallTipBox({icon: 'notification', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
      //   }
      //
      //   if (isTrue) {
      //     this[objectName][propertyName] = window.URL.createObjectURL(event.target.files[0])
      //     event.target.name = 'source'
      //     if (parseInt(event.target.getAttribute('data-key')) === 1) {
      //       event.target.nextElementSibling.name = ''
      //       event.target.nextElementSibling.value = null
      //       this.isShowUpload[propertyName] = false
      //     } else {
      //       event.target.previousElementSibling.name = ''
      //       event.target.previousElementSibling.value = null
      //       this.isShowUpload[propertyName] = true
      //     }
      //   } else {
      //     event.target.value = null
      //   }
      // },
      checkVerifyState (scope) {
        // 检查是否完成实名验证
        otcApi.getVerifyState((msg) => {
          switch (scope) {
            case 'bank_scope':
              this.bankReadOnly = false
              break
            case 'wechat_scope':
              this.wechatReadOnly = false
              break
            case 'alipay_scope':
              this.alipayReadOnly = false
              break
            case 'paypal_scope':
              this.paypalReadOnly = false
              break
          }
          this.$validator.errors.clear(scope)
        }, (msg) => {
          if (msg === 'KYC_AUTH_FIRST') {
            Vue.$confirmDialog({
              content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
              okCallback: () => {
                this.$emit('switchTab', 'mycenter')
                this.$emit('removeDialog')
              }
            })
          } else {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          }
        })
      },
      getList () {
        otcApi.getPaySettings((res) => {
          this.bankList = res.data.bankList
          console.log(this.bankList)
        })
      },
      update (data) {
        utils.setDialog(dialog, {
          item: data,
          okCallback: () => {
            this.getList()
          }
        })
      },
      del (id) {
        if (this.delStatus) {
          Vue.$confirmDialog({
            content: this.$t('gcox_otc.delete_bank_card'), // 是否删除该银行卡？
            okCallback: () => {
              this.delStatus = false
              otcApi.delPay(id, res => {
                Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${res.msg}`)})
                this.delStatus = true
                this.getList()
              }, msg => {
                this.delStatus = true
                Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
              })
            }
          })
        }
      },
      add () {
        // 先判断是否实名
        if (this.getUserInfo.kycState === 1) {
          utils.setDialog(dialog, {
            okCallback: () => {
              this.getList()
            }
          })
        } else {
          Vue.$confirmDialog({
            id: 'KYC_AUTH_FIRST',
            content: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
            okCallback: () => {
              this.$router.push({name: 'control_kyc'})
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .settings {
    & > h3 {
      background: #13143A;
      padding: 14px;
      color: #ffffff;
    }

    li {
      font-size: 16px;
      border: 1px solid #eeeeee;
      margin-top: 20px;
      transition: 0.3s;
      padding: 30px 50px;

      &:hover {
        box-shadow: 0 0 10px #DBDBDB;
      }

      .form-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .form-flex-center {
          width: 50%;

          p {
            padding: 5px;
          }
        }

        .form-flex-right {
          span {
            padding: 8px 20px;
            display: block;
            margin: 10px 0;
          }
        }
      }
    }
  }

  .add_li {
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;

    img {
      width: 38px;
      margin-right: 20px;
    }
  }
</style>


<!-- 微信 -->
<!--<li class="form-item">-->
<!--<h3>{{$t('otc_legal.otc_legal_WeChat_receivables')}}&lt;!&ndash;微信收款&ndash;&gt;</h3>-->
<!--<div class="form-flex" v-if="wechatReadOnly"  :class="{active:!infoLoaded}">-->
<!--<div class="form-flex-left">-->
<!--<i class="icon-wechat"></i>-->
<!--<em>{{$t('public0.public198')}}&lt;!&ndash;微信&ndash;&gt;</em>-->
<!--</div>-->
<!--<div class="form-flex-center">-->
<!--<div class="not-set" v-if="!wechatData.wechat_number">-->
<!--<p>{{$t('public0.public197')}}&lt;!&ndash;请设置微信账号及收款码，收付款更便捷&ndash;&gt;</p>-->
<!--</div>-->
<!--<div class="have-set" v-if="wechatData.wechat_number">-->
<!--<p class="wechat_name">{{$t('otc_legal.otc_legal_Payee_Name')}}&lt;!&ndash;收款人姓名&ndash;&gt;：{{wechatData.wechat_name}}</p>-->
<!--<p class="wechat_number">{{$t('otc_legal.otc_legal_Wechat_number')}}&lt;!&ndash;微信账号&ndash;&gt;：{{wechatData.wechat_number}}</p>-->
<!--</div>-->
<!--</div>-->
<!--<div class="form-flex-right">-->
<!--<span @click="checkVerifyState('wechat_scope')">{{$t('otc_legal.otc_legal_Set')}}&lt;!&ndash;设置&ndash;&gt;</span>-->
<!--</div>-->
<!--</div>-->
<!--<form class="form-col" ref="wechatForm" v-if="!wechatReadOnly" data-vv-scope="wechat_scope">-->
<!--<ul class="form-table">-->
<!--<li class="form-row form-row-top">-->
<!--<i class="form-icon icon-wechat"></i>-->
<!--<label class="form-label">{{$t('public0.public198')}}&lt;!&ndash;微信&ndash;&gt;</label>-->
<!--</li>-->
<!--<li class="form-row">-->
<!--<label class="form-label">{{$t('otc_legal.otc_legal_Payee_Name')}}&lt;!&ndash;收款人姓名&ndash;&gt;<em class="asterisk">&nbsp;*</em></label>-->
<!--<input class="form-input" type="text" name="wechat_name" :value="wechatData.wechat_name" autocomplete="off"/>-->
<!--</li>-->
<!--<li class="form-row">-->
<!--<label class="form-label">{{$t('otc_legal.otc_legal_Wechat_number')}}&lt;!&ndash;微信账号&ndash;&gt;<em class="asterisk">&nbsp;*</em></label>-->
<!--<input class="form-input" :class="{error: errors.has('wechat_scope.wechat_number')}" type="text" name="wechat_number" v-model="wechatData.wechat_number" v-validate="'required'" maxlength="32" autocomplete="off"/>-->
<!--<span class="form-error" v-if="errors.has('wechat_scope.wechat_number')">{{msgs.wechat_number[errors.firstRule('wechat_number')]}}</span>-->
<!--</li>-->
<!--<li class="form-row">-->
<!--<label class="form-label">{{$t('otc_legal.otc_legal_WeChat_code')}}&lt;!&ndash;微信收款码&ndash;&gt;<em class="asterisk">&nbsp;*</em></label>-->
<!--<div class="form-upload" :class="{error: errors.has('wechat_scope.wechat_QRcode')}">-->
<!--<img class="form-upload-img" v-if="wechatData.wechat_QRcode" :src="wechatData.wechat_QRcode"/>-->
<!--<span class="form-upload-span" v-if="!wechatData.wechat_QRcode">{{$t('otc_legal.otc_legal_Upload_payment')}}&lt;!&ndash;点击上传收款码&ndash;&gt;</span>-->
<!--<input type="hidden" v-model="wechatData.wechat_QRcode" data-vv-name="wechat_QRcode" v-validate="'required'"/>-->
<!--<input class="form-upload-file" type="file" title=" " data-key="1" v-show="isShowUpload.wechat_QRcode" @change="uploadImage($event, 3)"/>-->
<!--<input class="form-upload-file" type="file" name="source" title=" " data-key="2" v-show="!isShowUpload.wechat_QRcode" @change="uploadImage($event, 3)"/>-->
<!--</div>-->
<!--<span class="form-error" v-if="errors.has('wechat_scope.wechat_QRcode')">{{msgs.wechat_QRcode[errors.firstRule('wechat_QRcode')]}}</span>-->
<!--</li>-->
<!--<li class="form-row form-row-bottom">-->
<!--<input class="form-cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="wechatReadOnly=true"/>&lt;!&ndash;取消&ndash;&gt;-->
<!--<input class="form-save" type="button" :value="$t('otc_legal.otc_legal_save')" @click="saveSettings(3)"/>&lt;!&ndash;保存&ndash;&gt;-->
<!--</li>-->
<!--</ul>-->
<!--</form>-->
<!--</li>-->

<!--&lt;!&ndash; 支付宝 &ndash;&gt;-->
<!--<li class="form-item">-->
<!--<h3>{{$t('otc_legal.otc_legal_Alipay_receivables')}}&lt;!&ndash;支付宝收款&ndash;&gt;</h3>-->
<!--<div class="form-flex" v-if="alipayReadOnly"  :class="{active:!infoLoaded}">-->
<!--<div class="form-flex-left">-->
<!--<i class="icon-alipay"></i>-->
<!--<em>{{$t('public0.public199')}}&lt;!&ndash;支付宝&ndash;&gt;</em>-->
<!--</div>-->
<!--<div class="form-flex-center">-->
<!--<div class="not-set" v-if="!alipayData.alipay_number">-->
<!--<p>{{$t('public0.public261')}}&lt;!&ndash;请设置支付宝账号及收款码，收付款更便捷&ndash;&gt;</p>-->
<!--</div>-->
<!--<div class="have-set" v-if="alipayData.alipay_number">-->
<!--<p class="alipay_name">{{$t('otc_legal.otc_legal_Payee_Name')}}&lt;!&ndash;收款人姓名&ndash;&gt;：{{alipayData.alipay_name}}</p>-->
<!--<p class="alipay_number">{{$t('otc_legal.otc_legal_Alipay_number')}} &lt;!&ndash;支付宝账号&ndash;&gt;：{{alipayData.alipay_number}}</p>-->
<!--</div>-->
<!--</div>-->
<!--<div class="form-flex-right">-->
<!--<span @click="checkVerifyState('alipay_scope')">{{$t('otc_legal.otc_legal_Set')}}&lt;!&ndash;设置&ndash;&gt;</span>-->
<!--</div>-->
<!--</div>-->
<!--<form class="form-col" ref="alipayForm" v-if="!alipayReadOnly" data-vv-scope="alipay_scope">-->
<!--<ul class="form-table">-->
<!--<li class="form-row form-row-top">-->
<!--<i class="form-icon icon-alipay"></i>-->
<!--<label class="form-label">{{$t('public0.public199')}}&lt;!&ndash;支付宝&ndash;&gt;</label>-->
<!--</li>-->
<!--<li class="form-row">-->
<!--<label class="form-label">{{$t('otc_legal.otc_legal_Payee_Name')}}&lt;!&ndash;收款人姓名&ndash;&gt;<em class="asterisk">&nbsp;*</em></label>-->
<!--<input class="form-input" type="text" name="alipay_name" :value="alipayData.alipay_name" autocomplete="off" readonly/>-->
<!--</li>-->
<!--<li class="form-row">-->
<!--<label class="form-label">{{$t('otc_legal.otc_legal_Alipay_number')}}&lt;!&ndash;支付宝账号&ndash;&gt;<em class="asterisk">&nbsp;*</em></label>-->
<!--<input class="form-input" :class="{error: errors.has('alipay_scope.alipay_number')}" type="text" name="alipay_number" v-model="alipayData.alipay_number" v-validate="'required'" maxlength="32" autocomplete="off"/>-->
<!--<span class="form-error" v-if="errors.has('alipay_scope.alipay_number')">{{msgs.alipay_number[errors.firstRule('alipay_number')]}}</span>-->
<!--</li>-->
<!--<li class="form-row">-->
<!--<label class="form-label">{{$t('otc_legal.otc_legal_Aipay_code')}}&lt;!&ndash;支付宝收款码&ndash;&gt;<em class="asterisk">&nbsp;*</em></label>-->
<!--<div class="form-upload" :class="{error: errors.has('alipay_scope.alipay_QRcode')}">-->
<!--<img class="form-upload-img" v-if="alipayData.alipay_QRcode" :src="alipayData.alipay_QRcode"/>-->
<!--<span class="form-upload-span" v-if="!alipayData.alipay_QRcode">{{$t('otc_legal.otc_legal_Upload_payment')}}&lt;!&ndash;点击上传收款码&ndash;&gt;</span>-->
<!--<input type="hidden" v-model="alipayData.alipay_QRcode" data-vv-name="alipay_QRcode" v-validate="'required'"/>-->
<!--<input class="form-upload-file" type="file" title=" " data-key="1" v-show="isShowUpload.alipay_QRcode" @change="uploadImage($event, 2)"/>-->
<!--<input class="form-upload-file" type="file" name="source" title=" " data-key="2" v-show="!isShowUpload.alipay_QRcode" @change="uploadImage($event, 2)"/>-->
<!--</div>-->
<!--<span class="form-error" v-if="errors.has('alipay_scope.alipay_QRcode')">{{msgs.alipay_QRcode[errors.firstRule('alipay_QRcode')]}}</span>-->
<!--</li>-->
<!--<li class="form-row form-row-bottom">-->
<!--<input class="form-cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="alipayReadOnly=true"/>&lt;!&ndash;取消&ndash;&gt;-->
<!--<input class="form-save" type="button" :value="$t('otc_legal.otc_legal_save')" @click="saveSettings(2)"/>&lt;!&ndash;保存&ndash;&gt;-->
<!--</li>-->
<!--</ul>-->
<!--</form>-->
<!--</li>-->

<!-- PayPal -->
<!--<li class="form-item">-->
<!--<h3>{{$t('public0.public218')}}&lt;!&ndash;PayPal收款&ndash;&gt;</h3>-->
<!--<div class="form-flex" v-if="paypalReadOnly"  :class="{active:!infoLoaded}">-->
<!--<div class="form-flex-left">-->
<!--<i class="icon-paypal"></i>-->
<!--<em>{{$t('public0.public219')}}&lt;!&ndash;PayPal&ndash;&gt;</em>-->
<!--</div>-->
<!--<div class="form-flex-center">-->
<!--<div class="not-set" v-if="!paypalData.paypal_number">-->
<!--<p>{{$t('public0.public220')}}&lt;!&ndash;请设置PayPal信息&ndash;&gt;</p>-->
<!--</div>-->
<!--<div class="have-set" v-if="paypalData.paypal_number">-->
<!--<p class="wechat_name">{{$t('otc_legal.otc_legal_Payee_Name')}}&lt;!&ndash;收款人姓名&ndash;&gt;：{{paypalData.paypal_name}}</p>-->
<!--<p class="wechat_number">{{$t('public0.public221')}}&lt;!&ndash;PayPal账号&ndash;&gt;：{{paypalData.paypal_number}}</p>-->
<!--</div>-->
<!--</div>-->
<!--<div class="form-flex-right">-->
<!--<span @click="checkVerifyState('paypal_scope')">{{$t('otc_legal.otc_legal_Set')}}&lt;!&ndash;设置&ndash;&gt;</span>-->
<!--</div>-->
<!--</div>-->
<!--<form class="form-col" ref="paypalForm" v-if="!paypalReadOnly" data-vv-scope="paypal_scope">-->
<!--<ul class="form-table">-->
<!--<li class="form-row form-row-top">-->
<!--<i class="form-icon icon-paypal"></i>-->
<!--<label class="form-label">{{$t('public0.public219')}}&lt;!&ndash;PayPal&ndash;&gt;</label>-->
<!--</li>-->
<!--<li class="form-row">-->
<!--<label class="form-label">{{$t('otc_legal.otc_legal_Payee_Name')}}&lt;!&ndash;收款人姓名&ndash;&gt;<em class="asterisk">&nbsp;*</em></label>-->
<!--<input class="form-input" type="text" name="paypal_name" :value="paypalData.paypal_name" autocomplete="off" readonly/>-->
<!--</li>-->
<!--<li class="form-row">-->
<!--<label class="form-label">{{$t('public0.public221')}}&lt;!&ndash;PayPal账号&ndash;&gt;<em class="asterisk">&nbsp;*</em></label>-->
<!--<input class="form-input" :class="{error: errors.has('paypal_scope.paypal_number')}" type="text" name="paypal_number" v-model="paypalData.paypal_number" v-validate="'required'" maxlength="32" autocomplete="off"/>-->
<!--<span class="form-error" v-if="errors.has('paypal_scope.paypal_number')">{{msgs.paypal_number[errors.firstRule('paypal_number')]}}</span>-->
<!--</li>-->
<!--<li class="form-row form-row-bottom">-->
<!--<input class="form-cancel" type="button" :value="$t('otc_legal.otc_legal_cancel')" @click="paypalReadOnly=true"/>&lt;!&ndash;取消&ndash;&gt;-->
<!--<input class="form-save" type="button" :value="$t('otc_legal.otc_legal_save')" @click="saveSettings(4)"/>&lt;!&ndash;保存&ndash;&gt;-->
<!--</li>-->
<!--</ul>-->
<!--</form>-->
<!--</li>-->
