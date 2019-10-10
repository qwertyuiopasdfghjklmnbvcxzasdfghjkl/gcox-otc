<template>
  <div class="tip-box w1200 mt70">
    <h4 class="fs30 text-center">Buy and sell digital currency</h4>
    <p class="fs18 f-c-gray text-center mt20">{{$t('gcox_otc.otc_describe')}}<!-- otc是一个强大而无缝的交易平台，可以连接法定和加密的世界。  --></p>
    <div class="tips ui-flex mt70">
    <img src="src/assets/img/otc_describe.jpg">
      <!--<div class="ui-flex-1 ui-flex ui-flex-center">-->
        <!--<div>-->
          <!--<img src="../../assets/img/icon-knowledge.png">-->
          <!--<p class="item-title efont">{{$t('about.knowledge')}}&lt;!&ndash; 专业知识 &ndash;&gt;</p>-->
          <!--<p class="fs14">{{$t('about.desc_knowledge')}}&lt;!&ndash; 团队由30名经验丰富的专家引领，他们是各个商业和金融科技行业中经验丰富的顾问，创始人和经营管理者 &ndash;&gt;</p>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="ui-flex-1 ui-flex ui-flex-center">-->
        <!--<div>-->
          <!--<img src="../../assets/img/icon-safty.png">-->
          <!--<p class="item-title efont">{{$t('about.safty')}}&lt;!&ndash; 高度安全性 &ndash;&gt;</p>-->
          <!--<p class="fs14">{{$t('about.desc_safty')}}&lt;!&ndash; 专业的风险管理和保护系统 &ndash;&gt;</p>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="ui-flex-1 ui-flex ui-flex-center">-->
        <!--<div>-->
          <!--<img src="../../assets/img/icon-technology.png">-->
          <!--<p class="item-title efont">{{$t('about.technology')}}&lt;!&ndash; 先进的技术 &ndash;&gt;</p>-->
          <!--<p class="fs14">{{$t('about.desc_technology')}}&lt;!&ndash; 自主研发的区块链和高效率的交易引擎 &ndash;&gt;</p>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="ui-flex-1 ui-flex ui-flex-center">-->
        <!--<div>-->
          <!--<img src="../../assets/img/icon-tokens.png">-->
          <!--<p class="item-title efont">{{$t('about.tokens')}}&lt;!&ndash; 多元化的币种 &ndash;&gt;</p>-->
          <!--<p class="fs14">{{$t('about.desc_tokens')}}&lt;!&ndash; 提供主流加密货币交易对，包括BTC，ETH和ACM &ndash;&gt;</p>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>
<style lang="less" scoped>
.tip-box .tips{
  padding: 30px 0;
  justify-content: center;
  > div > div {
    width: 247px;
    text-align: center;
    img {
        width: 83px;
        height: 57px;
    }
    .item-title {
        margin-top: 10px;
        margin-bottom: 12px;
        font-size: 18px;
    }
  }
}
</style>
