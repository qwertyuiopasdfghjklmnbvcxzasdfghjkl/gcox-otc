<template>
  <div class="adressCava" @click="showSymbol = false">

    <div class="koall-verify-title">
      <p>{{$t('usercontent.user71')}}<!--充值--></p>
      <small @click="close()">
        <img src="../../assets/img/close.png">
      </small>
      <!--<router-link :to="'/account/digassets'">{{$t('usercontent.user58')}}&lt;!&ndash;我的资产&ndash;&gt;</router-link>-->
      <!--&gt;-->
      <!--<span>{{$t('usercontent.recharge')}}&lt;!&ndash;数字货币充值&ndash;&gt;</span>-->
    </div>
    <div class="copy">
      <p>{{symbol}}{{$t('referral.address')}} <!--充币地址--></p>
      <p class="address">{{addr}}</p>
      <label v-clipboard:copy="addr" v-clipboard:success="onCopy" v-clipboard:error="onError"></label>
    </div>
    <div class="tsmb">
      <!--<div class="tsmb-flex">-->
        <!--<p>{{$t('usercontent.notice')}}</p>-->
        <!--<label>-->
          <!--<p>{{$t('usercontent.not1').format(symbol)}}</p>-->
          <!--&lt;!&ndash;<p>{{$t('usercontent.not2').format(symbol,'0.01')}}</p>&ndash;&gt;-->
        <!--</label>-->
      <!--</div>-->
      <!--<div class="tsmb-flex blue">-->
        <!--<p>{{$t('usercontent.not3')}}</p>-->
        <!--<label style="padding-left: 4px">-->
          <!--<p>{{$t('usercontent.not3-1').format(symbol)}}</p>-->
        <!--</label>-->
      <!--</div>-->
      <p>{{$t('gcox_otc.fee')}}  {{procedureFee}}</p>
      <p>* {{$t('gcox_otc.explain').format(symbol)}}</p>
    </div>
    <!--<div class="title-div">-->
    <!--<small>{{$t('usercontent.user86')}}</small>-->
    <!--<p @click.stop="showSymbol = !showSymbol">{{symbol}}</p>-->
    <!--<ul v-show="showSymbol">-->
    <!--<li v-for="item in allData" @click.prevent="icheck(item)">{{item.symbol}}</li>-->
    <!--</ul>-->
    <!--</div>-->
    <div class="bottom-box">
      <div class="qrad">
        <div ref="qrcode" class="qrcode"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/assets/js/utils'
  import Vue from 'vue'
  import userUtils from '@/api/wallet'

  export default {
    props: ['paramSymbol'],
    data () {
      return {
        addr: null,
        symbol: null,
        allData: [],
        showSymbol: false,
        minWithdraw: '',
        procedureFee: ''
      }
    },
    watch: {
      addr () {
        utils.qrcode(this.$refs.qrcode, {
          text: this.addr,
          width: 190,
          height: 190
        })
      }
    },
    created () {
      this.symbol = this.paramSymbol || 'ETH'
      this.getListAccount()
      //console.log(this.addr, this.symbol)
      this.$nextTick(() => {
        utils.qrcode(this.$refs.qrcode, {
          text: this.addr,
          width: 190,
          height: 190
        })
      })
    },
    methods: {
      icheck (item) {
        //console.log(item)
        this.addr = item.address
        this.symbol = item.symbol
      },
      onCopy () {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`usercontent.copy-success`)})
      },
      onError () {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`usercontent.copy-error`)})
      },
      getListAccount () {
        userUtils.myAssets({}, res => {
          this.allData = res.filter(next => {
            if (next.type === 1) {
              if (next.symbol === this.symbol) {
                this.addr = next.address
                this.procedureFee = next.procedureFee
                //console.log(next)
              }
            }
            return next.type === 1
          })
        })
      },
      close () {
        this.$emit('removeDialog')
      }
    }
  }
</script>
<style scoped lang="less">
  .koall-verify-title {
    color: #333;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 30px;
    img{
      width: 16px;
      cursor: pointer;
    }
  }

  .adressCava {
    background-color: #fff;
    font-size: 16px;
    width: 900px;
    border-radius:8px;
    padding-bottom: 40px;

    .tsmb {
      margin: 10px auto;
      width: 480px;
      padding: 10px;
      line-height: 30px;
      background: #eeeeee;
      border-left: 4px solid #F0B936;

     p{
       padding: 6px;
     }
    }

    .title-div {
      margin-top: 18px;
      position: relative;

      small {
        line-height: 30px;
        color: #979799;
      }

      p {
        height: 32px;
        line-height: 32px;
        width: 350px;
        border-bottom: 1px solid hsla(0, 0%, 100%, .12);
        position: relative;

        &:after {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border: 1px solid #999;
          border-top-color: transparent;
          border-right-color: transparent;
          position: absolute;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          top: 10px;
          right: 16px;
        }

        &:hover:after {
          border-color: #00B5FF;
          border-top-color: transparent;
          border-right-color: transparent;
        }
      }

      ul {
        position: absolute;
        left: 0;
        top: 63px;
        list-style: none;
        padding: 6px 0;
        margin: 0;
        box-sizing: border-box;
        background-color: #212028;
        border: 1px solid #242329;
        width: 350px;

        li {
          font-size: 12px;
          padding: 0 20px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #f1f1f2;
          height: 34px;
          line-height: 34px;
          box-sizing: border-box;
          cursor: pointer;

          &:hover {
            background: #292831;
          }
        }
      }
    }
  }
  .copy {
    width: 500px;
    border: 1px solid hsla(0, 0%, 100%, .12);
    margin: 10px auto;
    position: relative;
    .address{
      padding: 15px;
      border:1px solid #cccccc;
      border-radius:3px;
      margin: 10px auto;
      color: #666;
      font-size: 18px;
      padding-right: 50px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    label {
      background: url("../../assets/img/cype.png") no-repeat center #eeeeee;
      background-size: 24px;
      text-align: center;
      position: absolute;
      cursor: pointer;
      right: 6px;
      width: 44px;
      height: 44px;
      bottom: 16px;
    }

  }
  .bottom-box {
    display: flex;
    /*justify-content: space-between;*/
    align-items: center;
    justify-content: center;
    margin: 0px auto;



    .qrad {
      width: 220px;
      text-align: center;
      /*background: #4c4a64;*/
      /*line-height: 60px;*/
      /*height: 60px;*/
      /*position: relative;*/

      .qrcode {
        display: block;
        /*position: absolute;*/
        /*top: 62px;*/
        /*left: 0;*/
        width: 190px;
        padding: 15px;
        background: #ffffff;
        height: 190px;

        img {
          width: 190px;
        }
      }
    }
  }
</style>
