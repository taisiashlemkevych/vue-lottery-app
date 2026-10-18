<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from "@/entities/session/model/auth.store";
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from "@/shared/ui/AppButton.vue";
import type { LoginCredentials } from '@/entities/session/model/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const authError = ref('')

const schema = yup.object({
  username: yup.string().required('Username є обов\'язковим'),
  password: yup.string().required('Пароль є обов\'язковим'),
})

const { handleSubmit } = useForm<LoginCredentials>({ validationSchema: schema })
const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  authError.value = ''
  try {
    await authStore.login(values)
    const redirectPath = (route.query.redirect as string) || '/users'
    router.push(redirectPath)
  } catch {
    authError.value = 'Невірний логін або пароль'
  }
})
</script>

<template>
  <div class="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
    <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Вхід в систему</h1>
    
    <div v-if="authError" class="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
      {{ authError }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <AppInput v-model="username" label="Username" placeholder="Введіть username (напр. emilys)" :error="usernameError" />
      <AppInput v-model="password" type="password" label="Пароль" placeholder="Введіть пароль (напр. emilyspass)" :error="passwordError" />
      
      <AppButton type="submit" class="w-full mt-4">Увійти</AppButton>
    </form>
    
    <p class="mt-4 text-xs text-gray-400 text-center">
      Тестовий доступ: emilys / emilyspass
    </p>
  </div>
</template>
