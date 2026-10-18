<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center px-4 py-10">
    <div
      class="w-full max-w-2xl rounded-3xl border border-sky-100 bg-white px-6 py-12 text-center shadow-[0_12px_40px_rgba(96,165,250,0.10)] sm:px-12">
      <div >
        <span class="text-5xl font-black tracking-tight text-sky-300">
          404
        </span>
      </div>
      <h1 class="mb-3 text-2xl font-bold text-slate-800 sm:text-3xl">
        Сторінку не знайдено
      </h1>

      <p class="mx-auto mb-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
        Схоже, ви перейшли за невірним посиланням.
      </p>

      <RouterLink to="/"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-sky-100">

        <path stroke-linecap="round" stroke-linejoin="round" d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-7h6v7" />

        Повернутися на головну
      </RouterLink>
    </div>
  </div>
</template>
