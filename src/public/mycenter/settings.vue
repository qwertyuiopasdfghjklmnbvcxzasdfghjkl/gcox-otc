<template>
  <div class="w1200 settings">
    <h3> {{$t('otc_legal.otc_legal_Bank_Transfer')}}<!--银行转账--></h3>
    <ul class="list">
      <!-- 银行卡 -->
      <li class="form-item" v-if="bankList.length" v-for="(item,i) in bankList" :key="i">
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
            <div class="btn">
              <span class="yellow_button" @click="update(item)">{{$t('account.user_center_change')}}<!--修改--></span>
              <span class="del" @click="del(item.card_number)">{{$t('public0.public3')}}<!--删除--></span>
            </div>
            <label class="check" @click="change(item)">
              <i :class="{active : item.is_default === 1}"></i>
              <span>{{$t('gcox_otc.default')}}<!--设为默认--></span>
            </label>
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
        delStatus: true,
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

    },
    created () {
      this.getList()
    },
    methods: {
      getList () {
        otcApi.getPaySettings((res) => {
          this.bankList = res.data.bankList
          console.log(this.bankList)
        })
      },
      update (data) {
        utils.setDialog(dialog, {
          item: data,
          list: this.bankList,
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
                Vue.$koallTipBox({icon: 'success', message: this.$t(`error_code.DELETE_SUCCESS`)})
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
        utils.setDialog(dialog, {
          list: this.bankList,
          okCallback: () => {
            this.getList()
          }
        })
      },
      change (d) {
        console.log(d)
        if (d.is_default === 0) {
          let data = {
            id: d.id
          }
          otcApi.setDefault(data, res => {
            this.getList()
          }, msg => {
            Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
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
          .btn {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .del {
              color: #0D66EF;
              cursor: pointer;
            }
          }

          .check {
            display: flex;
            align-items: center;

            i {
              width: 14px;
              height: 14px;
              border: 1px solid #686a77;
              cursor: pointer;

              &.active {
                border: 1px solid #00a0e9;

                &:before {
                  content: '✔';
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #00a0e9;
                  font-size: 12px;
                  line-height: 14px;
                }
              }
            }

            span {
              padding: 4px;
            }
          }

          span {
            padding: 8px 20px;
            display: block;
            margin: 10px 0;
            transition: all .2s;
          }
          span:hover {
            opacity: .75;
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
