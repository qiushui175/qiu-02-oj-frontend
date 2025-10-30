<template>
  <div id="userLoginView" class="login-container">
    <div class="login-card">
      <img src="@/assets/qiu-logo.png" alt="logo" class="login-logo" />
      <h2 class="login-title">用户登录</h2>

      <a-form
        class="login-form"
        :model="form"
        @submit="handleSubmit"
        layout="vertical"
      >
        <a-form-item
          field="userAccount"
          label="账号"
          :rules="[{ required: true, message: '请输入账号' }]"
        >
          <a-input
            v-model="form.userAccount"
            placeholder="请输入账号"
            allow-clear
          />
        </a-form-item>

        <a-form-item
          field="userPassword"
          label="密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
            allow-clear
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-button">
            登录
          </a-button>
        </a-form-item>

        <div class="login-footer">
          还没有账号？
          <span class="link" @click="goRegister">去注册</span>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { UserLoginRequest } from "@/api/models/UserLoginRequest";
import { UserControllerService } from "@/api/services/UserControllerService";
import { UserVO } from "@/api";

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

// 获取路由实例
const route = useRoute();

const handleSubmit = async () => {
  if (!form.userAccount) {
    message.warning("请输入账号");
    return;
  }
  if (!form.userPassword) {
    message.warning("请输入密码");
    return;
  }

  try {
    const res = await UserControllerService.userLoginUsingPost(form);
    if (res.code === 0) {
      const data = res.data as UserVO;
      store.commit("user/updateUser", data); 
      router.push({ path: route.query.redirect as string || "/", replace: true });
    } else {
      message.error("登录失败：" + res.message);
    }
  } catch {
    message.error("请求失败，请检查网络或服务器连接");
  }
};

const goRegister = () => {
  router.push("/user/register");
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: none;
}

.login-card {
  width: 380px;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px 32px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 12px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #222;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
  font-size: 16px;
  height: 40px;
}

.login-footer {
  text-align: center;
  margin-top: 10px;
  color: #666;
}

.link {
  color: #165dff;
  cursor: pointer;
  transition: color 0.2s;
}
.link:hover {
  color: #3c89ff;
}
</style>
