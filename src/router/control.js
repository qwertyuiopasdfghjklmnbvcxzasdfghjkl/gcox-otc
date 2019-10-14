import overall from '../public/control_panel/overall'
import deal from '../public/control_panel/deal'
import wallet from '../public/control_panel/wallet'
import kyc from '../public/control_panel/kyc'
import pay from '../public/control_panel/pay'

export default [
  {
    path: '/overall',
    name: 'overall',
    component: overall
  },
  {
    path: '/control_deal',
    name: 'control_deal',
    component: deal
  },
  {
    path: '/control_wallet',
    name: 'control_wallet',
    component: wallet
  },
  {
    path: '/control_kyc',
    name: 'control_kyc',
    component: kyc
  },
  {
    path: '/control_pay',
    name: 'control_pay',
    component: pay
  }
]
