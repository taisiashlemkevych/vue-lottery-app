<script setup lang="ts">
defineProps<{
    label: string
    variant?: string
    disabled?: boolean
    type?: 'button' | 'submit'
}>()

const emit = defineEmits<{
    click: []
}>()
</script>

<template>
    <button :type="type ?? 'button'" class="btn" :class="`btn-${variant ?? 'primary'}`" :disabled="disabled"
        @click="emit('click')">
        {{ label }}
    </button>
</template>
