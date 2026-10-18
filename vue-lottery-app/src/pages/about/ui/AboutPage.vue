<script setup lang="ts">
const skills = [
  'Vue.js 3',
  'TypeScript',
  'HTML & CSS',
  'Tailwind CSS & SCSS',
  'Figma',
  'Git & GitHub',
]
</script>

<template>
  <div class="bg-[#f4f9ff] p-8 rounded-2xl border border-[#dceafb]">
    <div class="mb-8">
  
      <h1 class="text-3xl font-bold text-[#344f70] mb-2">
        Таїсія Шлемкевич
      </h1>

      <p class="text-[#7890aa]">
        Студентка ЧНУ
      </p>
    </div>

    <div class="bg-white rounded-xl p-5 mb-7 border border-[#e3eefb]">
      <h2 class="text-lg font-semibold text-[#344f70] mb-3">
        Мої навички
      </h2>

      <p class="text-sm text-[#8297b0] leading-relaxed">
        Працюю над створенням сучасних вебінтерфейсів,
        вивчаю нові технології та вдосконалюю свої навички
        у frontend-розробці.
      </p>
    </div>

    <h2 class="text-lg font-semibold text-[#344f70] mb-4">
      Technical Skills
    </h2>

    <div class="flex flex-wrap gap-2 mb-8">
      <span v-for="skill in skills" :key="skill" class="bg-[#e4efff] text-[#4e76a5] px-3 py-2 rounded-lg text-sm">
        {{ skill }}
      </span>
    </div>

    <a href="https://github.com/taisiashlemkevych" target="_blank" rel="noopener noreferrer"
      class="inline-block bg-[#d9e9ff] text-[#355d8a] px-5 py-3 rounded-xl font-medium hover:bg-[#c8defb] transition-colors">
      Переглянути GitHub →
    </a>
  </div>
</template>
