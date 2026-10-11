<script setup lang="ts">
const technologies = [
  { name: 'Vue 3', category: 'Framework' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Vue Router', category: 'Routing' },
  { name: 'Tailwind CSS & SCSS', category: 'Styling' },
  { name: 'ESLint', category: 'Code Quality' },
  { name: 'Repository Pattern', category: 'Architecture' },
]
</script>

<template>
  <div class="bg-[#f3f8ff] p-8 rounded-2xl border border-[#dce9f8]">
    <div class="mb-7">
      <h1 class="text-3xl font-bold text-[#304b6b] mb-3">
        Vue Lottery App
      </h1>
    </div>

    <div class="bg-white rounded-xl p-5 mb-7 border border-[#e1ebf7]">
      <h2 class="text-lg font-semibold text-[#304b6b] mb-3">
        Про проєкт
      </h2>

      <p class="text-sm text-[#71869f] leading-relaxed">
        Реалізовано керування учасниками, пошук, сортування та вибір
        переможців. Також використовуються JWT-авторизація,
        Vue Router і Repository Pattern для організації роботи з REST API.
      </p>
    </div>

    <h2 class="text-lg font-semibold text-[#304b6b] mb-4">
      Технології
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
      <div
        v-for="tech in technologies"
        :key="tech.name"
        class="bg-white border border-[#e1ebf7] rounded-lg p-3"
      >
        <p class="text-sm font-semibold text-[#45698f]">
          {{ tech.name }}
        </p>
        <p class="text-xs text-[#96a9bf] mt-1">
          {{ tech.category }}
        </p>
      </div>
    </div>

    <a
      href="https://github.com/taisiashlemkevych/vue-lottery-app"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 bg-[#dceaff] text-[#355d8a] px-5 py-3 rounded-xl font-medium hover:bg-[#c9defb] transition-colors"
    >
      Переглянути проєкт на GitHub
      <span>→</span>
    </a>
  </div>
</template>
