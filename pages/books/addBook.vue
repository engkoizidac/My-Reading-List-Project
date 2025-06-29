<template>
  <UContainer class="py-10 flex justify-center">
    <div class="w-full max-w-xl">
      <h1 class="text-2xl font-bold mb-6 text-center">Add Book</h1>

      <UForm :state="form" @submit="onSubmit" class="space-y-5">
        <div>
          <UInput
            v-model="form.title"
            label="Title"
            placeholder="Enter book title"
            :error="errors.title"
            required
            class="w-full text-xl"
          />
        </div>

        <div>
          <UInput
            v-model="form.author"
            label="Author"
            placeholder="Enter author name"
            :error="errors.author"
            required
            class="w-full text-xl"
          />
        </div>

        <div class="flex items-center space-x-4">
          <UButton
            type="submit"
            color="green"
            variant="solid"
            label="Add Book"
            class="hover:underline"
          />
          <NuxtLink
            to="/"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-flex items-center gap-2"
            >Back to List
          </NuxtLink>
        </div>
      </UForm>
    </div>
  </UContainer>
</template>

<script setup>
const toast = useToast();

import { ref, reactive } from "vue";
import { bookSchema } from "~/validations/book";

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

  const formData = {
    ...form,
    is_read: false,
  };

  const result = bookSchema.safeParse(formData);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const path = issue.path[0];
      if (path in errors) errors[path] = issue.message;
    });

    return;
  }

  try {
    await $fetch("/api/books/post", {
      method: "POST",
      body: result.data,
    });

    success.value = true;
    form.title = "";
    form.author = "";
    form.is_read = false;

    toast.add({
      title: `Book successfully added!`,
      color: "success",
      id: "modal-success",
    });
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
}
</script>
