<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from "@/app/providers/services";
import type { User } from '@/entities/user/model/types'
import AppButton from "@/shared/ui/AppButton.vue";

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const user = ref<User | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    user.value = await userService.getById(Number(props.id))
  } catch {
    error.value = 'Не вдалося завантажити дані користувача'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <button @click="router.back()"
      class="text-sky-600 hover:text-sky-800 mb-6 flex items-center gap-2 font-medium transition-colors">
      ← Повернутися до списку
    </button>

    <div v-if="isLoading" class="text-center py-12 text-slate-500 bg-[#f4f8ff] rounded-2xl">
      Завантаження профілю...
    </div>

    <div v-else-if="error" class="text-center py-12 text-rose-500 bg-rose-50 rounded-2xl">
      {{ error }}
    </div>

    <div v-else-if="user" class="bg-[#f5f9ff] p-6 sm:p-8 rounded-2xl border border-[#e0eafa] shadow-sm">
      <div class="flex items-center gap-5 mb-8 pb-6 border-b border-[#dce8f7]">
        <img v-if="user.image" :src="user.image" :alt="user.firstName"
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-white border border-[#dce8f7]" />

        <div v-else
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#dceaff] flex items-center justify-center text-[#5279a8] font-bold text-3xl">
          {{ user.firstName[0] }}
        </div>

        <div class="min-w-0">
          <p class="text-xs uppercase tracking-widest text-sky-600 mb-2">
            User profile
          </p>

          <h1 class="text-2xl sm:text-3xl font-bold text-slate-700">
            {{ user.firstName }} {{ user.lastName }}
          </h1>

          <p class="text-slate-400 mt-1">
            @{{ user.username }}
          </p>
        </div>
      </div>

      <h2 class="text-lg font-semibold text-slate-700 mb-4">
        Особиста інформація
      </h2>

      <div class="mb-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-4 border-b border-[#dce8f7]">
          <p class="text-sm text-slate-400">Email</p>
          <p class="font-medium text-slate-700 break-words">{{ user.email }}</p>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-4 border-b border-[#dce8f7]">
          <p class="text-sm text-slate-400">Телефон</p>
          <p class="font-medium text-slate-700">{{ user.phone }}</p>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-4 border-b border-[#dce8f7]">
          <p class="text-sm text-slate-400">Вік</p>
          <p class="font-medium text-slate-700">{{ user.age }} років</p>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-4">
          <p class="text-sm text-slate-400">Стать</p>
          <p class="font-medium text-slate-700 capitalize">{{ user.gender }}</p>
        </div>
      </div>

      <div class="mt-7 pt-6 border-t border-[#dce8f7] flex justify-end">
        <AppButton @click="router.push(`/users/${user.id}/edit`)">
          Редагувати профіль
        </AppButton>
      </div>
    </div>
  </div>
</template>
