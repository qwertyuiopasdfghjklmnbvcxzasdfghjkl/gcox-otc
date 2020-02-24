<template>
  <div class="cont" @click="showDropdown=false">
    <!--<p class="title">
      <router-link :to="'/account/digassets'">{{$t('usercontent.user58')}}</router-link>
      >
      <span>{{$t('usercontent.user69')}}</span>
    </p>-->
    <div class="content">
      <div class="select">
        <div class="select-li">
          <span>{{$t('usercontent.user86')}}<!--币种--></span>
          <p @click.stop="showDropdown=!showDropdown">
            <span>{{symbol}}</span>
            <i class="icon-arrow-down2"></i>
          </p>
          <ul v-show="showDropdown" class="ul">
            <li v-for="item in symbolList" :class="{'active': item.symbol === symbol}"
                @click.prevent="selAdd(item.symbol)">{{item.symbol}}
            </li>
          </ul>
        </div>
        <label class="add">
          + <span @click="addAddress()">{{$t('usercontent.user87')}}<!--添加提币地址--></span>
        </label>
      </div>
      <dl class="tab">
        <dt>
          <span>{{$t('usercontent.user88')}}<!--提币地址--></span>
          <span>{{$t('usercontent.user89')}}<!--标签--></span>
          <span>{{$t('usercontent.user90')}}<!--备注--></span>
          <span>{{$t('usercontent.user91')}}<!--操作--></span>
        </dt>
        <dd v-if="addressList" v-for="item in addressList">
          <span>{{item.address}}</span>
          <span>{{item.memo}}</span>
          <span></span>
          <span><button class="btn" @click="del(item.withdrawId)">{{$t('public0.public3')}}</button></span>
        </dd>
        <dd v-show="!addressList.length">
          <p class="no_data">{{$t('public0.public50')}}</p>
        </dd>
      </dl>

    </div>
    <page v-if="addressList.length" :pageIndex="page"
          :pageSize="size"
          :total="total" @changePageIndex="pageChange"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'
  import walletApi from '../../api/wallet'
  import utils from '@/assets/js/utils'
  import add from './addSymbol'
  import page from '@/components/page'

  export default {
    name: 'addressManage',
    props: {
      symbol: {
        type: String,
        default: 'ETH'
      },
      list: {
        type: Array,
        default: []
      }
    },
    components:{page},
    data () {
      return {
        showDropdown: false,
        symbolList: [],
        addressList: [],
        page: 1,
        size: 10,
        total: 0
      }
    },
    watch: {
      symbol (e) {
        this.getAddressList()
      }
    },
    created () {
      this.getAllSymbol()
      this.getAddressList()
      if (this.getUserInfo().googleAuthEnable !== 1) {
        Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user35')})
        this.$router.push({name: 'control_wallet'})
      }
      /*
      if (this.getUserInfo().kycState !== 1) {
        Vue.$koallTipBox({icon: 'notification', message: this.$t('usercontent.user36')})
        this.$router.push({name: 'control_wallet'})
      }*/
    },
    methods: {
      ...mapGetters(['getUserInfo']),
      getAllSymbol () {
        this.symbolList = this.list.filter(item => {
          return item.type === 1
        })

      },
      selAdd (sym) {
        this.showDropdown = false
        this.symbol = sym
      },
      getAddressList () {
        let data = {
          symbol: this.symbol,
          page: this.page,
          size: this.size
        }
        walletApi.addressList(data, (res, total) => {
          this.addressList = res
          this.total = total
        })
      },
      addAddress () {
        utils.setDialog(add, {
          symbol: this.symbol,
          okCallback: () => {
            this.getAddressList()
          }
        })
      },
      del (id) {
        walletApi.deleteAddress({withdrawId: id}, res => {
          this.getAddressList()
          Vue.$koallTipBox({icon: 'success', message: this.$t(`${res.msg}`)})
        }, msg => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      pageChange(e){
        this.page = e
        this.getAddressList()
      }
    }
  }
</script>

<style scoped lang="less">
  .cont {
    background: #ffffff;
    color: #222222;
    font-size: 14px;

    .title {
      padding-top: 20px;
      font-size: 14px;

      a {
        color: #222222;
      }

      span {
        color: #979799;
      }
    }

    .content {
      padding: 40px 0;
      min-height: 200px;
      padding-bottom: 20px;

      .select {
        .add {
          float: right;
          cursor: pointer;
          padding: 10px;
          color: #F0B936;
        }

        .select-li {
          display: inline-flex;
          align-items: center;
          width: 440px;
          height: 45px;
          position: relative;

          p {
            border: 1px solid #EEEEEE;
            height: 36px;
            line-height: 36px;
            margin-left: 20px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            width: 200px;

            i {
              cursor: pointer;
            }
          }

          ul {
            position: absolute;
            top: 46px;
            left: 47px;
            z-index: 9;
            background: #ffffff;
            width: 225px;
            max-height: 200px;
            box-shadow: 2px 2px 12px #eee;
            overflow-y: auto;

            li {
              padding: 10px;
              font-size: 14px;
              transition: background 0.3s;
              border-bottom: 1px solid #eeeeee;

              &.active {
                color: #00B5FF;
              }

              &:hover {
                background: #efefef
              }
            }
          }
        }
      }

      .tab {
        display: block;
        margin-top: 20px;
        border: 1px solid #eee;

        dt, dd {
          display: flex;
          justify-content: space-between;
          padding: 12px 20px;
          background: #eeeeee;

          span {
            color: #222222;

            &:nth-child(1) {
              width: 300px;
            }

            &:nth-child(2) {
              width: 36px;
            }

            &:nth-child(3) {
              width: 60px;
            }

            &:nth-child(4) {
              width: 100px;
            }
          }
        }

        dd {
          background: #ffffff;
          border-bottom: 1px solid #eeeeee;

          &:last-child {
            border-bottom: none;
          }

          .no_data {
            text-align: center;
            width: 100%;
          }
        }
      }
    }

    .btn {
      cursor: pointer;
      font-size: 12px;
      color: #f1f1f2;
      background-color: #F0B936;
      padding: 7px 20px;
      border-radius: 4px;
    }
  }
</style>
