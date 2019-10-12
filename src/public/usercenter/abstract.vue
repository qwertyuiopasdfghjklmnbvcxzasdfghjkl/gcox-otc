<template>
    <div>
      <div class="top">
        <p class="w1200">{{$t('home.intro')}}<!-- 简介 --></p>
      </div>
      <div class="cont w1200">
        <div class="left">
          <div class="tab">
            <p class="title">{{getUserInfo.username}}{{$t('home.intro')}}<!-- 简介 --></p>
            <p><span>{{$t('gcox_otc.does')}}</span><span>--</span></p>
            <p><span>{{$t('gcox_otc.success_deal')}}</span><span>--</span></p>
            <p><span>{{$t('gcox_otc.dif_pat')}}</span><span>--</span></p>
            <p><span>{{$t('gcox_otc.back_score')}}</span><span>--</span></p>
            <p><span>{{$t('gcox_otc.user_build_time')}}</span><span>--</span></p>
            <p><span>{{$t('gcox_otc.last_login')}}</span><span>--</span></p>
            <p><span>{{$t('gcox_otc.kyc_idcard')}}</span><span>--</span></p>
            <p><span>{{$t('gcox_otc.peer_authentication')}}</span><span>--</span></p>
            <p><span>{{$t('shop.phone')}}</span><span>--</span></p>
            <p class="tow_button"><button>{{$t('gcox_otc.new_buyer')}}</button><button>{{$t('gcox_otc.arrears_goods')}}</button></p>
            <p class="one_button"><button>{{$t('gcox_otc.block_account')}}</button></p>
          </div>
          <div class="list">
            <div class="list_box">
              <h4><img src="../../assets/img/flag.png"/>{{$t('gcox_otc.buy_form').format('BTC')}}{{getUserInfo.username}}</h4>
              <div></div>
              <p>{{$t('gcox_otc.not_advertising')}}</p>
            </div>
            <div class="list_box">
              <h4><img src="../../assets/img/flag.png"/>{{$t('gcox_otc.sell_to').format('BTC')}}{{getUserInfo.username}}</h4>
              <div></div>
              <p>{{$t('gcox_otc.not_advertising')}}</p>
            </div>
          </div>

        </div>
        <div class="right">
          <h4>{{$t('gcox_otc.back_communications').format(getUserInfo.username)}}</h4>
          <p>{{$t('gcox_otc.no_communications')}}</p>
        </div>
      </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'abstract',
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getLang'])
    },
    created () {

    },
    methods: {}

  }
</script>

<style scoped lang="less">
  .top{
    background: #13143A;
    height: 30px;
    padding: 40px 0;
    p{
      font-size: 24px;
      color: #ffffff;
    }
  }
  .cont{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 30px auto;
    .left{
      width: 500px;
      .tab{
        border: 1px solid #eeeeee;
        border-radius:4px;
        overflow: hidden;
        .title{
          background: #13143A;
          color: #ffffff;
          font-size: 18px;
          border-top: none;
        }
        p{
          padding:15px 20px;
          font-size: 16px;
          line-height: 26px;
          border-top: 1px solid #eeeeee;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span:first-child{
            width: 100px;
            margin-right: 30px;
          }
        }
        .tow_button{
          justify-content: center;
          button{
            width:110px;
            height:36px;
            background:rgba(230,86,86,1);
            border-radius:18px;
            font-size: 18px;
            color: #ffffff;
            margin:10px;
          }
        }
        .one_button{
          justify-content: center;
          button{
            width:172px;
            height:50px;
            background:rgba(230,86,86,1);
            border-radius:3px;
            font-size: 18px;
            color: #ffffff;
            margin: 20px auto;
          }
        }
      }
    }
    .right{
      text-align: center;
      flex: 1;
      h4{
        font-weight: 400;
        font-size: 30px;
        padding: 20px 0;
      }
      p{
        color: #999999;
      }
    }
  }
  .list{
    margin-top: 40px;
    .list_box{
      margin: 30px 0;
      h4{
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 400;
        img{
          width: 20px;
          height: 26px;
          margin-right: 10px;
        }
      }
      p{
        padding: 10px 30px;
        color: #999999;
      }
    }
  }

</style>
