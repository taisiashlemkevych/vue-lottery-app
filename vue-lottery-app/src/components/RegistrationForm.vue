<script setup lang="ts">
import { reactive, ref } from "vue";
import BaseInput from "./BaseInput.vue";
import BaseButton from "./BaseButton.vue";
import type { Participant } from "../types/Participant";

const props = defineProps<{
  participants: Participant[];
}>();

const emit = defineEmits<{
  save: [participant: Participant];
}>();

const form = reactive({
  name: "",
  email: "",
  phone: "",
  birthDate: "",
});

const errors = reactive({
  name: "",
  email: "",
  phone: "",
  birthDate: "",
});

const generalError = ref("");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+380\d{9}$/;

function clearErrors() {
  errors.name = "";
  errors.email = "";
  errors.phone = "";
  errors.birthDate = "";
  generalError.value = "";
}

function validate(): boolean {
  clearErrors();

  let valid = true;

  if (!form.name.trim()) {
    errors.name = "Name is required.";
    valid = false;
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
    valid = false;
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = "Enter a valid email.";
    valid = false;
  } else {
    const normalizedEmail = form.email.trim().toLowerCase();

    const emailExists = props.participants.some(
      (participant) =>
        participant.email.trim().toLowerCase() === normalizedEmail,
    );

    if (emailExists) {
      errors.email = "A participant with this email already exists.";
      valid = false;
    }
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone is required.";
    valid = false;
  } else if (!phoneRegex.test(form.phone.trim())) {
    errors.phone = "Phone must have format +380XXXXXXXXX.";
    valid = false;
  }

  if (!form.birthDate) {
    errors.birthDate = "Birth date is required.";
    valid = false;
  } else {
    const today = new Date();
    const selectedDate = new Date(form.birthDate);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      errors.birthDate = "Birth date cannot be in the future.";
      valid = false;
    }
  }

  return valid;
}

function resetForm() {
  form.name = "";
  form.email = "";
  form.phone = "";
  form.birthDate = "";

  clearErrors();
}

function handleSubmit() {
  if (!validate()) {
    return;
  }

  emit("save", {
    id: Date.now(),
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    birthDate: form.birthDate,
  });

  resetForm();
}

function handleKeydown() {
  handleSubmit();
}
</script>

<template>
  <section class="card lottery-card">
    <div class="card-body">
      <h2 class="h4 mb-4">Registration</h2>

      <div v-if="generalError" class="alert alert-danger">
        {{ generalError }}
      </div>

      <form
        @submit.prevent="handleSubmit"
        @keydown.enter.prevent="handleKeydown"
      >
        <BaseInput
          v-model="form.name"
          label="Name"
          placeholder="Enter name"
          :error="errors.name"
        />

        <BaseInput
          v-model="form.email"
          label="Email"
          type="text"
          placeholder="example@email.com"
          :error="errors.email"
        />

        <BaseInput
          v-model="form.phone"
          label="Phone"
          placeholder="+380XXXXXXXXX"
          :error="errors.phone"
        />

        <BaseInput
          v-model="form.birthDate"
          label="Birth date"
          type="date"
          :error="errors.birthDate"
        />

        <div class="d-flex gap-2">
          <BaseButton label="Save" type="submit" />
        </div>
      </form>
    </div>
  </section>
</template>
