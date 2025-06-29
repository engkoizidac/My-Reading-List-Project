<template>
  <UContainer class="py-10 flex justify-center">
    <div class="w-full max-w-xl">
      <h1 class="text-2xl font-bold mb-6 text-center">
        Edit Book: <span v-if="originalTitle">{{ originalTitle }}</span>
      </h1>

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

        <div>
          <UCheckbox
            v-model="form.is_read"
            label="Mark as Read"
            class="text-lg"
          />
        </div>

        <div class="flex items-center space-x-4">
          <UButton
            type="submit"
            color="green"
            variant="solid"
            label="Save Changes"
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
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "#imports";
import { bookSchema } from "~/validations/book";

const toast = useToast();
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
      if (issue.path[0] in errors) {
        errors[issue.path[0]] = issue.message;
      }
    }
    return;
  }

  try {
    await $fetch(`/api/books/${bookId}`, {
      method: "PUT",
      body: result.data,
    });
    success.value = true;
    toast.add({
      title: "Book successfully updated!",
      color: "success",
    });
    originalTitle.value = form.title;
  } catch (err) {
    errorMsg.value = "Something went wrong.";
  }
}

fetchBook();
</script>
