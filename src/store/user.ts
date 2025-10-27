// initial state
import { StoreOptions } from "vuex";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      id: null,
      userName: "未登录",
    },
  }),
  getters: {
    /**
     * 判断当前是否已登录
     * - 登录状态：有有效 id
     * - 未登录：id 为空或 null
     */
    isLogin: (state) => {
      return !!state.loginUser && !!state.loginUser.id;
    },
  },
  actions: {
    getLoginUser({ commit, state }, payload) {
      // TODO 从远程去获取登录信息
      commit("updateUser", payload);
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
    /**
     * 登出或重置为未登录状态
     */
    resetUser(state) {
      state.loginUser = {
        id: null,
        userName: "未登录",
        userRole: "guest",
      };
    },
  },
} as StoreOptions<any>;
