<script setup lang="ts">
import { reactive } from 'vue'
import AppInput from './ui/AppInput.vue'
import AppButton from './ui/AppButton.vue'

const props = defineProps<{
  existingEmails: string[]
}>()

const emit = defineEmits<{
  (e: 'add-participant', participant: { name: string; dob: string; email: string; phone: string }): void
}>()

const form = reactive({
  name: '',
  dob: '',
  email: '',
  phone: ''
})

const errors = reactive({
  name: '',
  dob: '',
  email: '',
  phone: ''
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\+380\d{9}$/

const clearErrors = () => {
  errors.name = ''
  errors.dob = ''
  errors.email = ''
  errors.phone = ''
}

const resetForm = () => {
  form.name = ''
  form.dob = ''
  form.email = ''
  form.phone = ''
  clearErrors()
}

const handleSubmit = () => {
  clearErrors()
  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'This value is required.'
    isValid = false
  }

  if (!form.dob) {
    errors.dob = 'This value is required.'
    isValid = false
  } else {
    const selectedDate = new Date(form.dob)
    const today = new Date()
    if (selectedDate > today) {
      errors.dob = 'Date of birth cannot be in the future.'
      isValid = false
    }
  }

  if (!form.email.trim()) {
    errors.email = 'This value is required.'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email format.'
    isValid = false
  } else {
    const isDuplicate = props.existingEmails.some(
      email => email.toLowerCase() === form.email.toLowerCase()
    )
    if (isDuplicate) {
      errors.email = 'Participant with this email already exists.'
      isValid = false
    }
  }

  if (!form.phone.trim()) {
    errors.phone = 'This value is required.'
    isValid = false
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = 'Phone must be in format +380XXXXXXXXX'
    isValid = false
  }

  if (isValid) {
    emit('add-participant', { ...form })
    resetForm()
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <div class="mb-6">
      <h2 class="text-lg font-bold text-gray-800 uppercase tracking-wide">Register Form</h2>
      <p class="text-sm text-gray-500">Please fill in all the fields.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <AppInput
        v-model="form.name"
        label="Name"
        placeholder="Enter user name"
        :error="errors.name"
      />

      <AppInput
        v-model="form.dob"
        type="date"
        label="Date of Birth"
        :error="errors.dob"
      />

      <AppInput
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="Enter email"
        :error="errors.email"
      />

      <AppInput
        v-model="form.phone"
        label="Phone number"
        placeholder="+380XXXXXXXXX"
        :error="errors.phone"
      />

      <div class="flex justify-end pt-2">
        <AppButton type="submit">Save</AppButton>
      </div>
    </form>
  </div>
</template>
