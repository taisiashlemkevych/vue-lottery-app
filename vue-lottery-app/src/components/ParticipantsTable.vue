<script setup lang="ts">
import type { Participant } from '../types/participant'
import AppButton from './ui/AppButton.vue'

defineProps<{
  participants: Participant[]
  sortKey: 'name' | 'dob' | null
  sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits<{
  (e: 'sort', key: 'name' | 'dob'): void
  (e: 'edit', participant: Participant): void
  (e: 'delete', participant: Participant): void
}>()

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mt-6">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-800 font-bold border-b border-gray-100 select-none">
          <tr>
            <th class="px-6 py-4">#</th>
            <th class="px-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors" @click="emit('sort', 'name')">
              Name <span v-if="sortKey === 'name'" class="ml-1 text-primary">{{ sortOrder === 'asc' ? '↓' : '↑'
                }}</span>
            </th>
            <th class="px-6 py-4 cursor-pointer hover:bg-gray-200 transition-colors" @click="emit('sort', 'dob')">
              Date of Birth <span v-if="sortKey === 'dob'" class="ml-1 text-primary">{{ sortOrder === 'asc' ? '↓' : '↑'
                }}</span>
            </th>
            <th class="px-6 py-4">Email</th>
            <th class="px-6 py-4">Phone number</th>
            <th class="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="participants.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">Список учасників пустий або нічого не знайдено
            </td>
          </tr>
          <tr v-for="(participant, index) in participants" :key="participant.id"
            class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4 text-gray-400">{{ index + 1 }}</td>
            <td class="px-6 py-4">{{ participant.name }}</td>
            <td class="px-6 py-4">{{ formatDate(participant.dob) }}</td>
            <td class="px-6 py-4">{{ participant.email }}</td>
            <td class="px-6 py-4">{{ participant.phone }}</td>
            <td class="px-6 py-4 flex gap-3">
              <AppButton variant="primary" @click="emit('edit', participant)">
                Edit
              </AppButton>

              <AppButton variant="danger" @click="emit('delete', participant)">
                Delete
              </AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
