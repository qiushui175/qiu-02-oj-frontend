import ACCESS_ENUM from './accessEnum'

/**
 * 校验权限
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限
 * @return 是否用过校验
 */
const checkAccess = (loginUser: any, needAccess: string | undefined) => {
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true
  }

  if (needAccess === ACCESS_ENUM.USER) {
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) return false
  }

  if (needAccess === ACCESS_ENUM.ADMIN && loginUserAccess != ACCESS_ENUM.ADMIN)
    return false

  return true
}

export default checkAccess;