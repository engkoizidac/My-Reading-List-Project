<template>
  <UContainer class="mx-auto py-10 flex justify-center">
    <div class="w-full max-w-6xl">
      <!-- Changed from max-w-xl to max-w-2xl -->
      <h1 class="text-2xl font-bold mb-6 text-center">My Reading Book List</h1>

      <div class="mb-6 flex justify">
        <NuxtLink
          to="/books/addbook"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-flex items-center gap-2"
        >
          <Icon name="i-heroicons-plus" />
          <span>Add Book</span>
        </NuxtLink>
      </div>

      <!-- Make UCard wider by adding a class -->
      <div
        v-for="(book, index) in books"
        :key="book.title + index"
        class="mb-4"
      >
        <UCard class="w-full">
          <!-- Add w-full to make card fill container -->
          <template #header>
            <div class="flex justify-between items-center">
              <div>
                <span class="text-lg font-semibold">{{ book.title }}</span>
                <div class="text-gray-500 italic text-sm">
                  by {{ book.author }} -
                  <span
                    class="font-medium"
                    :class="book.is_read ? 'text-green-600' : 'text-yellow-600'"
                  >
                    {{ book.is_read ? "Read" : "Unread" }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 items-center">
                <UButton
                  variant="text"
                  color="purple"
                  class="text-purple-600 hover:text-purple-400 hover:underline"
                  :icon="
                    book.is_read
                      ? 'i-heroicons-book-open'
                      : 'i-heroicons-eye-slash'
                  "
                  @click="toggleRead(index)"
                >
                  {{ book.is_read ? "Mark Unread" : "Mark Read" }}
                </UButton>

                <UButton
                  color="red"
                  variant="solid"
                  label="Delete"
                  icon="i-heroicons-trash"
                  class="text-red-600 hover:text-red-400 hover:underline"
                  @click="handleDeleteClick(index)"
                />
              </div>
            </div>
          </template>
        </UCard>
      </div>
      <UModal v-model:open="open">
        <template #title> Delete Book Confirmation </template>

        <template #description>
          This action will permanently delete the book from your list.
        </template>

        <template #content>
          <div class="p-6 text-center">
            <p class="text-xl font-semibold mb-4">
              Are you sure you want to delete:
            </p>
            <p v-if="selectedBook">
              {{ selectedBook.title }} by {{ selectedBook.author }}
            </p>

            <div class="mt-6 flex justify-center gap-4">
              <UButton
                color="red"
                variant="solid"
                label="Delete"
                class="hover:underline"
                @click="deleteBook"
              />
              <UButton label="Cancel" @click="closeModal" />
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </UContainer>
</template>

<script setup>
const toast = useToast();

//fetch the books data from the API
const { data: books } = await useFetch("/api/books/books");

// Sort books by title
if (books.value) {
  books.value.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );
}

//function for read/unread toggle
async function toggleRead(index) {
  const book = books.value[index];
  console.log("Toggling read status for:", book.id);
  try {
    const res = await fetch(`/api/books/${book.id}/toggle`, {
      method: "PUT",
    });
    console.log("Response status:", res.status);

    if (!res.ok) throw new Error("Failed to toggle read status");

    const updatedBook = await res.json();
    books.value[index].is_read = updatedBook.is_read;

    const statusText = books.value[index].is_read ? "Read" : "Unread";
    toast.add({
      title: `Book successfully marked as ${statusText}!`,
      color: "success",
      id: "modal-success",
    });
  } catch (error) {
    alert("Error toggling read status.");
    console.error(error);
  }
}

//function to delete a book
import { ref } from "vue";
const open = ref(false);
const bookToDelete = ref(null);

function handleDeleteClick(index) {
  bookToDelete.value = index;
  open.value = true;
}

const selectedBook = computed(() => {
  if (!books.value || bookToDelete.value === null) return null;
  return books.value[bookToDelete.value] || null;
});

function closeModal() {
  open.value = false;
}

async function deleteBook() {
  const index = bookToDelete.value;
  if (index === null) return;

  const book = books.value[index];
  try {
    const res = await fetch(`/api/books/${book.id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    toast.add({
      title: `Book successfully deleted!`,
      color: "success",
      id: "modal-success",
    });
    books.value.splice(index, 1);
    bookToDelete.value = null;
    open.value = false;
  } catch (error) {
    alert("An error occurred while deleting the book.");
    console.error(error);
    bookToDelete.value = null;
    open.value = false;
  }
}
</script>
