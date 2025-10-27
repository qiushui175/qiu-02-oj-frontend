import store from '@/store' // 确保 store 是导出的对象，而不是 useStore()
import router from '@/router'
import checkAccess from './checkAccess'

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const loginUser = store.state.user?.loginUser
  if (!to.meta.access || checkAccess(loginUser, to.meta.access)) {
    // 不需要权限，或者权限校验通过
    next()
  } else {
    // 需要权限
    if(!loginUser || !loginUser.userRole){
      // 未登录状态，转到登录页
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }

    // 无权限情况
    next('/noAuth')
  }
})

export default router
