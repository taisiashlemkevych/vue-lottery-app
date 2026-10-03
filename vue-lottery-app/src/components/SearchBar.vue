<script setup lang="ts">
import { ref, watch } from 'vue'

const search = ref('')

const emit = defineEmits<{
    'filter-by-name': [value: string]
}>()

let timeoutId: ReturnType<typeof setTimeout> | undefined

watch(search, value => {
    if (timeoutId) {
        clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
        emit('filter-by-name', value)
    }, 300)
})
</script>

<template>
    <div class="input-group search-bar">

        <input v-model="search" type="search" class="form-control" placeholder="Search by name...">
    </div>
</template>