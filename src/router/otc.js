import Home from '@/otc/home'
import order from '../otc/orderDetail'

const routes = [
  {
    path: '/otc',
    name: 'otc_detail',
    component: order,
    meta: {login: true}
  }
]

export default routes
