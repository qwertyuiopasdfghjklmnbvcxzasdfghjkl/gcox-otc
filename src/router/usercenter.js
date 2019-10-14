import set from '../public/usercenter/set'
import abstract from '../public/usercenter/abstract'

export default [
  {
    path: '/usercenter_set',
    name: 'usercenter_set',
    component: set,
    meta: {login: true}
  },
  {
    path: '/usercenter_abstract',
    name: 'usercenter_abstract',
    component: abstract,
    meta: {login: true}
  },
]
