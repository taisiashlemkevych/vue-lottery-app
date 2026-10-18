<script setup lang="ts">
import { reactive } from 'vue'
import AppInput from '@/shared/ui/AppInput.vue'
import AppButton from "@/shared/ui/AppButton.vue";
import type { Participant } from '@/entities/participant/model/types'

const props = defineProps<{
  participant: Participant
  existingEmails: string[]
}>()

const emit = defineEmits<{
  (e: 'save', updatedParticipant: Participant): void
}>()

const form = reactive({ ...props.participant })
const errors = reactive({ name: '', dob: '', email: '', phone: '' })

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^\+380\d{9}$/

const clearErrors = () => {
  errors.name = ''; errors.dob = ''; errors.email = ''; errors.phone = ''
}

const handleSubmit = () => {
  clearErrors()
  let isValid = true

  if (!form.name.trim()) 
  { 
    errors.name = 'Required'; 
    isValid = false 
  }
  if (!form.dob) 
  { 
    errors.dob = 'Required'; 
    isValid = false 
  }
  else if (new Date(form.dob) > new Date()) 
  { 
    errors.dob = 'Cannot be in future'; 
    isValid = false 
  }

  if (!form.email.trim()) 
  { 
    errors.email = 'Required'; 
    isValid = false 
  }
  else if (!emailRegex.test(form.email)) 
  { 
    errors.email = 'Invalid format'; 
    isValid = false 
  }
  else {
    const isDuplicate = props.existingEmails.some(
      email => email.toLowerCase() === form.email.toLowerCase() && email.toLowerCase() !== props.participant.email.toLowerCase()
    )
    if (isDuplicate) { errors.email = 'Email already exists'; isValid = false }
  }

  if (!form.phone.trim()) 
  { 
    errors.phone = 'Required'; 
    isValid = false 
  }
  else if (!phoneRegex.test(form.phone)) 
  { 
    errors.phone = 'Must be +380XXXXXXXXX'; 
    isValid = false 
  }

  if (isValid) {
    emit('save', { ...form })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <AppInput v-model="form.name" label="Name" :error="errors.name" />
    <AppInput v-model="form.dob" type="date" label="Date of Birth" :error="errors.dob" />
    <AppInput v-model="form.email" type="email" label="Email" :error="errors.email" />
    <AppInput v-model="form.phone" label="Phone number" :error="errors.phone" />

    <div class="flex justify-end pt-4">
      <AppButton type="submit">Оновити дані</AppButton>
    </div>
  </form>
</template>
