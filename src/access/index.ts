import store from '@/store' // 确保 store 是导出的对象，而不是 useStore()
import router from '@/router'
import checkAccess from './checkAccess'
import ACCESS_ENUM from './accessEnum'

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  let loginUser = store.state.user?.loginUser

  if (!loginUser || !loginUser.userRole) {
    console.log("auto login")
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user?.loginUser
  }
  console.log(store.state.user)

  if (!to.meta.access || checkAccess(loginUser, to.meta.access)) {
    // 不需要权限，或者权限校验通过
    next()
  } else {
    // 需要权限
    if(!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN){
      // 未登录状态，转到登录页
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }

    // 无权限情况
    next('/noAuth')
  }
})

export default router
