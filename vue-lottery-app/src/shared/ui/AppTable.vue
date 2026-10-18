<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export interface AppTableColumn {
  field: string
  header: string
  sortable?: boolean
  bodyClass?: string
}

defineProps<{
  value: Record<string, unknown>[]
  columns: AppTableColumn[]
  loading?: boolean
  emptyMessage?: string
}>()
</script>

<template>
  <div
    class="app-table overflow-x-auto rounded-xl border border-[#e3edf8] bg-white"
  >
    <DataTable
      :value="value"
      :loading="loading"
      :empty-message="emptyMessage || 'Даних не знайдено'"
      striped-rows
      responsive-layout="scroll"
      table-style="min-width: 40rem"
      :pt="{
        root: { class: 'bg-white text-slate-700' },
        tableContainer: { class: 'bg-white' },
        table: { class: 'w-full border-collapse bg-white' },
        thead: { class: 'bg-[#eaf3ff] text-[#49698e]' },
        headerRow: { class: 'bg-[#eaf3ff]' },
        tbody: { class: 'bg-white' },
        row: {
          class: 'border-t border-slate-100 bg-white hover:bg-[#f7faff] transition-colors'
        },
        emptyMessage: { class: 'px-4 py-10 text-center text-slate-400' },
        mask: { class: 'bg-white/70' }
      }"
    >
      <Column
        v-for="column in columns"
        :key="column.field"
        :field="column.field"
        :header="column.header"
        :sortable="column.sortable ?? false"
        :pt="{
          headerCell: {
            class: 'bg-[#eaf3ff] px-4 py-4 text-left font-semibold text-[#49698e] border-b border-[#e3edf8]'
          },
          bodyCell: {
            class: 'bg-white px-4 py-4 text-sm text-slate-600 border-t border-slate-100'
          }
        }"
      >
        <template #body="{ data }">
          <slot :name="`cell-${column.field}`" :data="data">
            {{ data[column.field] }}
          </slot>
        </template>
      </Column>

      <Column
        v-if="$slots.actions"
        header="Дії"
        :pt="{
          headerCell: {
            class: 'bg-[#eaf3ff] px-4 py-4 text-right font-semibold text-[#49698e] border-b border-[#e3edf8]'
          },
          bodyCell: {
            class: 'bg-white px-4 py-4 text-right text-sm border-t border-slate-100'
          }
        }"
      >
        <template #body="{ data }">
          <slot name="actions" :data="data" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>