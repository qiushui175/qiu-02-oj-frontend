// initial state
import { UserControllerService } from "@/api";
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
    async getLoginUser({ commit }) {
      // TODO 从远程去获取登录信息
      const res = await UserControllerService.getLoginUserUsingGet(); 
      if (res.code === 0 && res.data) {
        commit("updateUser", res.data); // 接口成功且有数据，更新用户状态
      } else {
        // 接口返回失败（如未登录），重置为未登录状态
        commit("resetUser");
      }
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
