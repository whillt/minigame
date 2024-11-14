<template>
  <div class="login-dialog" v-if="visible">
    <div class="dialog-content">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      
      <div class="form-item">
        <label>手机号</label>
        <input type="text" v-model="phone" placeholder="请输入手机号">
      </div>

      <div class="form-item">
        <label>密码</label>
        <input type="password" v-model="password" placeholder="请输入密码">
      </div>

      <div class="form-item" v-if="!isLogin">
        <label>确认密码</label>
        <input type="password" v-model="confirmPassword" placeholder="请再次输入密码">
      </div>

      <div class="form-item" v-if="!isLogin">
        <label>昵称</label>
        <input type="text" v-model="nickname" placeholder="请输入昵称">
      </div>

      <div class="error-message" v-if="errorMsg">{{ errorMsg }}</div>

      <div class="dialog-buttons">
        <button @click="handleSubmit">{{ isLogin ? '登录' : '注册' }}</button>
        <button @click="close">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  visible: boolean
  score?: number
  level?: number
}>()

const emit = defineEmits(['update:visible', 'success'])

const userStore = useUserStore()
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const nickname = ref('')
const errorMsg = ref('')
const isLogin = ref(true)

const handleSubmit = async () => {
  try {
    errorMsg.value = ''
    
    if (!phone.value) {
      errorMsg.value = '请输入手机号'
      return
    }

    if (!password.value) {
      errorMsg.value = '请输入密码'
      return
    }

    if (!isLogin.value && password.value !== confirmPassword.value) {
      errorMsg.value = '两次密码输入不一致'
      return
    }

    // 这里添加实际的登录/注册逻辑
    const mockUser = {
      id: 1,
      nickname: nickname.value || '玩家1',
      phone: phone.value,
      region: '中国'
    }
    
    userStore.setUser(mockUser)
    emit('success')
    emit('update:visible', false)
  } catch (error) {
    errorMsg.value = '操作失败，请稍后重试'
    console.error(error)
  }
}

const close = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
.login-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 300px;
}

.form-item {
  margin: 15px 0;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
}

.form-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  color: red;
  margin: 10px 0;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-child {
  background: #1890ff;
  color: white;
}

button:last-child {
  background: #f5f5f5;
}
</style> 