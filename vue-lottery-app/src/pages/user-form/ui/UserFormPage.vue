<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useUsersStore } from '@/entities/user/model/users.store'
import type { CreateUserDto } from '@/entities/user/model/types'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from '@/shared/ui/AppButton.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const { fetchUser, createUser, updateUser } = usersStore

const isEditMode = ref(false)
const isLoading = ref(false)
const userId = ref<number | null>(null)

if (route.params.id) {
  isEditMode.value = true
  userId.value = Number(route.params.id)
}

const schema = yup.object({
  firstName: yup.string().required("Ім'я є обов'язковим"),
  lastName: yup.string().required("Прізвище є обов'язковим"),
  username: yup.string().required("Username є обов'язковим"),
  email: yup.string().email('Невірний формат email').required("Email є обов'язковим"),
  password: yup.string().min(6, 'Пароль має містити мінімум 6 символів').required("Пароль є обов'язковим"),
  age: yup.number().typeError('Має бути числом').required("Вік є обов'язковим").min(1, 'Мінімум 1 рік'),
  gender: yup.string().required("Стать є обов'язковою"),
  phone: yup.string().required("Телефон є обов'язковим"),
})

const { handleSubmit, setValues } = useForm<CreateUserDto>({
  validationSchema: schema,
})

const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName')
const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName')
const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')
const { value: age, errorMessage: ageError } = useField<number>('age')
const { value: gender, errorMessage: genderError } = useField<string>('gender', {
  initialValue: 'male',
})
const { value: phone, errorMessage: phoneError } = useField<string>('phone')

onMounted(async () => {
  if (isEditMode.value && userId.value) {
    try {
      const user = await fetchUser(userId.value)

      setValues({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: user.password || '',
        age: user.age,
        gender: user.gender,
        phone: user.phone,
      })
    } catch {
      alert('Помилка завантаження користувача')
      router.back()
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  try {
    if (isEditMode.value && userId.value) {
      await updateUser(userId.value, values)
    } else {
      await createUser(values)
    }

    router.push('/users')
  } catch {
    alert('Помилка під час збереження')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative my-8">
      
      <button @click="router.push('/users')" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold">✕</button>
      
      <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Редагувати користувача' : 'Створити користувача' }}</h2>

      <form @submit.prevent="onSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppInput v-model="firstName" label="Ім'я" :error="firstNameError" />
        <AppInput v-model="lastName" label="Прізвище" :error="lastNameError" />
        <AppInput v-model="username" label="Username" :error="usernameError" />
        <AppInput v-model="email" type="email" label="Email" :error="emailError" />
        <AppInput v-model="password" type="password" label="Пароль" :error="passwordError" />
        <AppInput v-model="age" type="number" label="Вік" :error="ageError" />
        
        <div class="flex flex-col gap-1 w-full">
          <label class="text-sm font-semibold text-gray-700">Стать</label>
          <select v-model="gender" class="border rounded-md px-3 py-2 outline-none border-gray-300 focus:border-primary">
            <option value="male">Чоловіча</option>
            <option value="female">Жіноча</option>
          </select>
          <span v-if="genderError" class="text-xs text-red-500">{{ genderError }}</span>
        </div>

        <AppInput v-model="phone" label="Телефон" :error="phoneError" />

        <div class="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
          <AppButton variant="secondary" @click="router.push('/users')">Скасувати</AppButton>
          <AppButton type="submit" :disabled="isLoading">
            {{ isLoading ? 'Збереження...' : (isEditMode ? 'Оновити' : 'Створити') }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>
