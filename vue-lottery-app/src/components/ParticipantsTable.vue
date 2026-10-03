<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { Participant } from "../types/Participant";
import SearchBar from "./SearchBar.vue";
import Modal from "./Modal.vue";
import BaseInput from "./BaseInput.vue";

const props = defineProps<{
  participants: Participant[];
}>();

const emit = defineEmits<{
  update: [participant: Participant];
  delete: [id: number];
}>();

const searchQuery = ref("");
const sortField = ref<"name" | "birthDate" | null>(null);
const sortAscending = ref(true);

const editingParticipant = ref<Participant | null>(null);
const deletingParticipant = ref<Participant | null>(null);

const editForm = reactive({
  name: "",
  email: "",
  phone: "",
  birthDate: "",
});

const editErrors = reactive({
  name: "",
  email: "",
  phone: "",
  birthDate: "",
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex = /^\+380\d{9}$/;

const filteredAndSortedParticipants = computed(() => {
  let result = [...props.participants];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();

    result = result.filter((participant) =>
      participant.name.toLowerCase().includes(query),
    );
  }

  if (sortField.value) {
    result.sort((a, b) => {
      const first =
        sortField.value === "name" ? a.name.toLowerCase() : a.birthDate;

      const second =
        sortField.value === "name" ? b.name.toLowerCase() : b.birthDate;

      const comparison = first.localeCompare(second);

      return sortAscending.value ? comparison : -comparison;
    });
  }

  return result;
});

function handleSearch(value: string) {
  searchQuery.value = value;
}

function sortBy(field: "name" | "birthDate") {
  if (sortField.value === field) {
    sortAscending.value = !sortAscending.value;
  } else {
    sortField.value = field;
    sortAscending.value = true;
  }
}

function startEditing(participant: Participant) {
  editingParticipant.value = participant;

  editForm.name = participant.name;
  editForm.email = participant.email;
  editForm.phone = participant.phone;
  editForm.birthDate = participant.birthDate;

  clearEditErrors();
}

function clearEditErrors() {
  editErrors.name = "";
  editErrors.email = "";
  editErrors.phone = "";
  editErrors.birthDate = "";
}

function validateEdit(): boolean {
  clearEditErrors();

  let valid = true;

  if (!editForm.name.trim()) {
    editErrors.name = "Name is required.";
    valid = false;
  }

  if (!editForm.email.trim()) {
    editErrors.email = "Email is required.";
    valid = false;
  } else if (!emailRegex.test(editForm.email)) {
    editErrors.email = "Enter a valid email.";
    valid = false;
  }

  const duplicateEmail = props.participants.some(
    (participant) =>
      participant.id !== editingParticipant.value?.id &&
      participant.email.toLowerCase() === editForm.email.trim().toLowerCase(),
  );

  if (duplicateEmail) {
    editErrors.email = "A participant with this email already exists.";
    valid = false;
  }

  if (!editForm.phone.trim()) {
    editErrors.phone = "Phone is required.";
    valid = false;
  } else if (!phoneRegex.test(editForm.phone)) {
    editErrors.phone = "Phone must have format +380XXXXXXXXX.";
    valid = false;
  }

  if (!editForm.birthDate) {
    editErrors.birthDate = "Birth date is required.";
    valid = false;
  } else {
    const today = new Date();
    const selectedDate = new Date(editForm.birthDate);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      editErrors.birthDate = "Birth date cannot be in the future.";
      valid = false;
    }
  }

  return valid;
}

function updateParticipant() {
  if (!editingParticipant.value) {
    return;
  }

  if (!validateEdit()) {
    return;
  }

  emit("update", {
    id: editingParticipant.value.id,
    name: editForm.name.trim(),
    email: editForm.email.trim(),
    phone: editForm.phone.trim(),
    birthDate: editForm.birthDate,
  });

  editingParticipant.value = null;
}

function askDelete(participant: Participant) {
  deletingParticipant.value = participant;
}

function confirmDelete() {
  if (!deletingParticipant.value) {
    return;
  }

  emit("delete", deletingParticipant.value.id);

  deletingParticipant.value = null;
}

watch(editingParticipant, (value) => {
  if (!value) {
    clearEditErrors();
  }
});
</script>

<template>
  <section class="card lottery-card">
    <div class="card-body">
      <div class="participants-header">
        <div>
          <h2 class="h4 mb-1">Participants</h2>

          <span class="text-secondary">
            {{ participants.length }} participants
          </span>
        </div>

        <SearchBar @filter-by-name="handleSearch" />
      </div>

      <div v-if="participants.length === 0" class="empty-state">
        No participants yet.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle participants-table">
          <thead>
            <tr>
              <th>
                <div class="table-sort">
                  Name

                  <button
                    type="button"
                    class="btn btn-sm btn-light"
                    @click="sortBy('name')"
                  >
                    {{
                      sortField === "name" ? (sortAscending ? "↑" : "↓") : "↕"
                    }}
                  </button>
                </div>
              </th>

              <th>Email</th>
              <th>Phone</th>

              <th>
                <div class="table-sort">
                  Birth date

                  <button
                    type="button"
                    class="btn btn-sm btn-light"
                    @click="sortBy('birthDate')"
                  >
                    {{
                      sortField === "birthDate"
                        ? sortAscending
                          ? "↑"
                          : "↓"
                        : "↕"
                    }}
                  </button>
                </div>
              </th>

              <th class="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="participant in filteredAndSortedParticipants"
              :key="participant.id"
            >
              <td>{{ participant.name }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td>{{ participant.birthDate }}</td>

              <td>
                <div class="table-actions">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    @click="startEditing(participant)"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="askDelete(participant)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <Modal
    v-if="editingParticipant"
    title="Edit participant"
    @close="editingParticipant = null"
  >
    <form @submit.prevent="updateParticipant">
      <BaseInput
        v-model="editForm.name"
        label="Name"
        :error="editErrors.name"
      />

      <BaseInput
        v-model="editForm.email"
        label="Email"
        type="email"
        :error="editErrors.email"
      />

      <BaseInput
        v-model="editForm.phone"
        label="Phone"
        :error="editErrors.phone"
      />

      <BaseInput
        v-model="editForm.birthDate"
        label="Birth date"
        type="date"
        :error="editErrors.birthDate"
      />

      <div class="modal-actions">
        <button
          type="button"
          class="btn btn-secondary"
          @click="editingParticipant = null"
        >
          Cancel
        </button>

        <button type="submit" class="btn btn-primary">Оновити дані</button>
      </div>
    </form>
  </Modal>

  <Modal
    v-if="deletingParticipant"
    title="Delete participant"
    @close="deletingParticipant = null"
  >
    <p>
      Ви дійсно бажаєте видалити учасника
      <strong>{{ deletingParticipant.name }}</strong
      >, {{ deletingParticipant.email }}?
    </p>

    <template #footer>
      <button
        type="button"
        class="btn btn-secondary"
        @click="deletingParticipant = null"
      >
        Ні
      </button>

      <button type="button" class="btn btn-danger" @click="confirmDelete">
        Так
      </button>
    </template>
  </Modal>
</template>
