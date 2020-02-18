<template>
  <div class="referral">
    <div class="ref-info ui-flex">
      <div class="ui-flex-1">
        <div class="item">
          <span>{{$t('referral.invitation_code')}}<!-- Invitation Code -->:</span> {{invitedInfo.myInvitationCode}}
          <button type="button" class="mint-btn default copy" v-clipboard:copy="invitedInfo.myInvitationCode"
                  v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('referral.copy')}}<!-- 复制 --></button>
        </div>
        <div class="item">
          <span>{{$t('referral.invitation_link')}}<!-- Invitation Link -->:</span> {{myInvitationUrl}}
          <button type="button" class="mint-btn default copy" v-clipboard:copy="myInvitationUrl"
                  v-clipboard:success="onCopy" v-clipboard:error="onError">{{$t('referral.copy')}}<!-- 复制 --></button>
        </div>
        <div class="item">
          <span>{{$t('referral.share_to')}}<!-- Share to -->:</span>
          <div class="media">
            <a class="icon-twitter" :href="`https://twitter.com/share?text=${shareTitle}&url=${myInvitationUrl}`"
               target="_blank"></a>
            <a class="icon-facebook1"
               :href="`https://www.facebook.com/sharer.php?title=${shareTitle}&u=${myInvitationUrl}`"
               target="_blank"></a>
          </div>
        </div>
      </div>
    </div>

    <div class="ref-profit mt50">
      <div class="ref-qr">
        <div ref="inviteQR" class="inviteQR"></div>
        <p class="mt10">{{$t('referral.referral_title')}}<!-- Invite friend to scan QR code to register --></p>
      </div>
    </div>

    <div class="ref-history mt50">
      <ul class="tabs">
        <li class="">{{$t('referral.invitation_history')}}<!-- Invitation History --></li>
      </ul>
      <div class="detail" v-show="active">
        <div class="ref-history-list">
          <ul>
            <li class="header ui-flex">
              <span class="ui-flex-1">{{$t('account.user_center_account')}}<!-- Account --></span>
              <span class="ui-flex-1">{{$t('referral.registeration_time')}}<!-- Registeration Time --></span>
              <span class="ui-flex-1">{{$t('referral.invitation_status')}}<!-- Invitation Status --></span>
              <!--<span class="ui-flex-1">{{$t('referral.refunded')}}&lt;!&ndash; Refunded &ndash;&gt; (ACM)</span>-->
            </li>
            <li class="ui-flex" v-for="item in historyList">
              <span class="ui-flex-1">{{item.username}}</span>
              <span class="ui-flex-1">{{item.registerTime}}</span>
              <span class="ui-flex-1">{{getStatus(item.status)}}</span>
              <!--<span class="ui-flex-1">{{item.status!==-1?item.amount:0}}</span>-->
            </li>
          </ul>
          <page v-if="!showLoading && historyList.length > 0" :pageIndex="params.page" :pageSize="params.size"
                :total="total" @changePageIndex="pageChange"/>
          <div class="nodata text-center mt20" v-if="!showLoading && historyList.length === 0">
            <div class="nodata-icon icon-no-order"></div>
            <div class="nodata-text">{{$t('public0.public50')}}<!--暂无相关数据--></div>
          </div>
          <loading v-if="showLoading"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters, mapActions} from 'vuex'
  import utils from '@/assets/js/utils'
  import loading from '@/components/loading'
  import userApi from '@/api/user'
  import page from '@/components/page'
  import Config from '@/assets/js/config'

  export default {
    components: {
      page,
      loading,
    },
    data () {
      return {
        showLoading: false,
        showStatus: false,
        active: true,
        invitedInfo: {},
        statusList: ['', 1, -1],
        historyList: [],
        params: {
          status: '',
          page: 1,
          size: 10,
          startTime: ''
        },
        total: 0,

      }
    },
    computed: {
      ...mapGetters(['getUserInfo', 'getLang']),
      myInvitationUrl () {
        return `${Config.origin}/register?ref=${this.invitedInfo.myInvitationCode}`
      },
      shareTitle () {
        if (this.getLang === 'en') {
          return `GCOX invitation from ${this.getUserInfo.nickname || this.getUserInfo.username}`
        } else {
          return `来自${this.getUserInfo.nickname || this.getUserInfo.username}的GCOX邀请`
        }
      },
      paramsChange () {
        return {
          status: this.params.status,
          page: this.params.page,
          size: this.params.size,
          startTime: this.params.startTime
        }
      }
    },
    watch: {
      paramsChange () {
        this.getInvitedRecord()
      }
    },
    created () {
      this.getInvitedInfo()
      this.getInvitedRecord()
    },
    mounted () {

    },
    methods: {
      ...mapActions([]),
      onCopy () {
        Vue.$koallTipBox({icon: 'success', message: this.$t(`usercontent.copy-success`)})
      },
      onError () {
        Vue.$koallTipBox({icon: 'notification', message: this.$t(`usercontent.copy-error`)})
      },
      setTime (key) {
        let nowdate = new Date()
        switch (key) {
          case 'day':
            nowdate = new Date(nowdate.setHours(0, 0, 0, 0)).getTime()
            break
          case 'month':
            nowdate = new Date(nowdate.setHours(0, 0, 0, 0))
            nowdate = new Date(nowdate.setMonth(nowdate.getMonth() - 1)).getTime()
            break
          default:
            nowdate = new Date(nowdate.setHours(0, 0, 0, 0))
            nowdate = new Date(nowdate.setFullYear(nowdate.getFullYear() - 1)).getTime()
        }
        this.params.startTime = nowdate
      },
      getInvitedInfo () {
        userApi.getInvitedInfo(res => {
          this.invitedInfo = res
          this.initQRCode()
        }, msg => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
        })
      },
      getInvitedRecord () {
        this.showLoading = true
        userApi.getInvitedRecord(this.params, (total, res) => {
          this.historyList = res
          this.total = total
          this.showLoading = false
        }, msg => {
          Vue.$koallTipBox({icon: 'notification', message: this.$t(`error_code.${msg}`)})
          this.showLoading = false
        })
      },
      pageChange (currentIndex) {
        this.params.page = currentIndex
      },
      getStatus (status) {
        let rst = this.$t('account.user_uncompleted')
        console.log(status)
        switch (status) {
          case '':
            rst = this.$t('trade_record.trade_record_all')
            break
          case 0:
          case 1:
            rst = this.$t('account.user_complete')
            break
          case -1:
            rst = this.$t('account.user_uncompleted')
            break
        }
        return rst
      },
      initQRCode () {
        //初始化二维码
        utils.qrcode(this.$refs.inviteQR, {
          text: this.myInvitationUrl,
          colorDark: '#000000',
          width: 320,
          height: 320,
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .referral {
    color: #333333;
    min-height: 200px;
  }

  .ref-info {
    border: 1px solid #eeeeee;
    padding: 0 10px;

    .item {
      line-height: 40px;
      border-bottom: 1px solid #eee;
      position: relative;
      padding: 10px 0;
      font-size: 18px;

      span {
        display: inline-block;
        min-width: 140px;
        vertical-align: middle;
        text-align: right;
        margin-right: 20px;
      }

      .copy {
        position: absolute;
        right: 0;
        width: 100px;
        background-color: #F0B936;
        border: none;
        color: #fff;
        cursor: pointer;
        margin-top: 2px;
        font-size: 14px;
      }

      .media {
        font-size: 20px;
        display: inline-block;
        vertical-align: middle;

        a {
          cursor: pointer;
        }

        a + a {
          margin-left: 20px;
        }
      }

    }
  }

  .ref-profit {
    > div {
      padding: 18px 0;
      text-align: center;
    }
  }

  .ref-history {
    border: 1px solid #eeeeee;
    .tabs {

      li {
        color: #444140;
        font-size: 20px;
        cursor: pointer;
        padding: 20px;
        position: relative;
      }

      li.active {
        color: #00a0e9;
      }

      li:after {
        content: '';
        position: absolute;
        width: 110px;
        height: 5px;
        left: 50%;
        margin-left: -55px;
        bottom: -3px;
        background-color: transparent;
      }

      li.active:after {
        background-color: #00a0e9;
      }
    }

    .detail {
      min-height: 200px;
    }

    .selector {
      li {
        min-width: 80px;
        text-align: center;

        & + li {
          margin-left: 35px;
        }

        p {
          padding-bottom: 10px;
        }

        button {
          background-color: #615F5F;
          color: #fff;
          font-size: 14px;
          position: relative;

          i {
            position: absolute;
            right: 10px;
            top: 11px;
          }
        }

        .status {
          width: 140px;
        }
      }
    }
  }

  .status-list {
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 1px;
    border-radius: 4px;
    background-color: #615f5f;
    line-height: 35px;
    z-index: 1;

    > div {
      border-bottom: 1px solid #545454;
      cursor: pointer;

      &:last-of-type {
        border-bottom: none;
      }

      &:hover {
        background-color: #545454;
      }
    }
  }

  .ref-history-list ul li {
    padding: 15px;
    font-size: 16px;
  }

  .ref-history-list ul li:not(.header) {
    border-bottom: 1px solid #eeeeee;

    &:hover {
      background-color: #dcdcdc;
    }
  }

  .nodata .nodata-icon {
    height: 80px;
    line-height: 80px;
    font-size: 40px;
    color: #A1A1A1;
  }

  .nodata .nodata-text {
    height: 40px;
    line-height: 20px;
    color: #A1A1A1;
  }

  .ref-history-list {
    .header{
      background: #F3F3F3;
    }
  }
  .ref-qr {
    width: 350px;
    margin: 0 auto;
    font-size: 18px;
  }

  .inviteQR {
    width: 320px;
    height: 320px;
    background-color: #fff;
    padding: 10px;

    /deep/ img, canvas {
      width: 100%;
    }
  }

</style>

