<template>
  <div id="userRegisterView" class="login-container">
    <div class="login-card">
      <img src="@/assets/qiu-logo.png" alt="logo" class="login-logo" />
      <h2 class="login-title">用户注册</h2>

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
          field="userName"
          label="昵称"
          :rules="[{ required: true, message: '请输入昵称' }]"
        >
          <a-input
            v-model="form.userName"
            placeholder="请输入昵称"
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

        <a-form-item
          field="checkPassword"
          label="确认密码"
          :rules="[{ required: true, message: '请确认密码' }]"
        >
          <a-input-password
            v-model="form.checkPassword"
            placeholder="请再次输入密码"
            allow-clear
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-button">
            注册
          </a-button>
        </a-form-item>

        <div class="login-footer">
          已有账号？
          <span class="link" @click="goLogin">去登录</span>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import message from '@arco-design/web-vue/es/message'
import { useRouter } from 'vue-router'
import { UserRegisterRequest } from '@/api/models/UserRegisterRequest'
import { UserControllerService } from '@/api/services/UserControllerService'

const form = reactive({
  userAccount: '',
  userName: '',
  userPassword: '',
  checkPassword: ''
} as UserRegisterRequest)

const router = useRouter()

const handleSubmit = async () => {
  if (form.userPassword !== form.checkPassword) {
    message.warning('两次输入的密码不一致')
    return
  }

  try {
    const res = await UserControllerService.userRegisterUsingPost(form)
    if (res.code === 0) {
      message.success('注册成功，请登录')
      router.push('/user/login')
    } else {
      message.error('注册失败：' + res.message)
    }
  } catch {
    message.error('请求失败，请检查网络或服务器连接')
  }
}

const goLogin = () => {
  router.push('/user/login')
}
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
