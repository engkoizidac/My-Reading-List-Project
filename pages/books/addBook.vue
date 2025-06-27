<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Add Book</h1>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Title</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border rounded px-3 py-2"
        />
        <p v-if="errors.title" class="text-red-600 text-sm mt-1">
          {{ errors.title }}
        </p>
      </div>
      <div>
        <label class="block font-semibold mb-1">Author</label>
        <input
          v-model="form.author"
          type="text"
          class="w-full border rounded px-3 py-2"
        />
        <p v-if="errors.author" class="text-red-600 text-sm mt-1">
          {{ errors.author }}
        </p>
      </div>
      <div>
        <label class="inline-flex items-center">
          <input v-model="form.is_read" type="checkbox" class="mr-2" />
          Mark as Read
        </label>
      </div>
      <button
        type="submit"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Book
      </button>
      <NuxtLink to="/" class="ml-4 text-blue-600 hover:underline"
        >Back to List</NuxtLink
      >
    </form>
    <p v-if="success" class="text-green-700 mt-4">Book added successfully!</p>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { bookSchema } from "../../validations/book";

const form = reactive({
  title: "",
  author: "",
  is_read: false,
});

const errors = reactive({
  title: "",
  author: "",
});

const success = ref(false);

async function onSubmit() {
  errors.title = "";
  errors.author = "";
  success.value = false;

  const result = bookSchema.safeParse(form);

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors[issue.path[0]] = issue.message;
    }
    return;
  }

  try {
    const response = await $fetch("/api/books/post", {
      method: "POST",
      body: result.data, // already validated
    });
    alert("Book added successfully!");
  } catch (err) {
    alert("Something went wrong.");
  }

  success.value = true;
  form.title = "";
  form.author = "";
  form.is_read = false;
}
</script>
