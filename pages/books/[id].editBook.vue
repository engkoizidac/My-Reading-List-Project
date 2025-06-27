<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">
      Edit Book: <span v-if="originalTitle">{{ originalTitle }}</span>
    </h1>
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
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
      <NuxtLink to="/" class="ml-4 text-blue-600 hover:underline">
        Back to List
      </NuxtLink>
    </form>
    <p v-if="success" class="text-green-700 mt-4">Book updated successfully!</p>
    <p v-if="errorMsg" class="text-red-700 mt-4">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { bookSchema } from "../../validations/book";

const route = useRoute();
const bookId = route.params.id;

const form = reactive({
  title: "",
  author: "",
  is_read: false,
});
const originalTitle = ref("");
const errors = reactive({
  title: "",
  author: "",
});
const errorMsg = ref("");
const success = ref(false);

async function fetchBook() {
  try {
    const data = await $fetch(`/api/books/${bookId}`);
    form.title = data.title;
    form.author = data.author;
    form.is_read = data.is_read;
    originalTitle.value = data.title;
  } catch (e) {
    errorMsg.value = "Book not found.";
  }
}

async function onSubmit() {
  errors.title = "";
  errors.author = "";
  errorMsg.value = "";
  success.value = false;

  const result = bookSchema.safeParse(form);

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors[issue.path[0]] = issue.message;
    }
    return;
  }

  try {
    await $fetch(`/api/books/${bookId}`, {
      method: "PUT",
      body: result.data,
    });
    success.value = true;
    originalTitle.value = form.title;
  } catch (err) {
    errorMsg.value = "Something went wrong.";
  }
}

fetchBook();
</script>
