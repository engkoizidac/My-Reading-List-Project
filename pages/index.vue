<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Book List</h1>

    <!-- Add Book Button: Navigate to Add Book Page (addBook.vue in pages)-->
    <div class="mb-6">
      <NuxtLink
        to="/books/addbook"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Book
      </NuxtLink>
    </div>

    <!-- This is mapping of the data from the API and display it to the page-->
    <div v-for="(book, index) in books" :key="book.title + index">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-lg font-semibold">{{ book.title }}</p>
          <p class="text-gray-700">
            by {{ book.author }} -
            <span
              class="font-medium"
              :class="book.is_read ? 'text-green-600' : 'text-yellow-600'"
            >
              {{ book.is_read ? "Read" : "Unread" }}
            </span>
          </p>
        </div>

        <!-- This is the action buttons container to manage the book record -->
        <div class="space-x-2">
          <NuxtLink
            v-if="book.id"
            :to="`/books/${book.id}.editBook`"
            class="text-blue-600 hover:underline"
          >
            Edit
          </NuxtLink>
          <button
            class="text-red-600 hover:underline"
            @click="deleteBook(index)"
          >
            Delete
          </button>

          <button
            class="text-purple-600 hover:underline"
            @click="toggleRead(index)"
          >
            {{ book.is_read ? "Mark Unread" : "Mark Read" }}
          </button>
        </div>
      </div>

      <!-- A separator between book entries -->
      <hr v-if="index !== books.length - 1" class="my-4 border-gray-300" />
    </div>
  </div>
</template>

<script setup>
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
  } catch (error) {
    alert("Error toggling read status.");
    console.error(error);
  }
}

//function to delete a book
async function deleteBook(index) {
  const book = books.value[index];
  const confirmed = confirm(`Are you sure you want to delete "${book.title}"?`);

  if (!confirmed) return;

  try {
    const res = await fetch(`/api/books/${book.id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    books.value.splice(index, 1);
    alert("Book deleted successfully.");
  } catch (error) {
    alert("An error occurred while deleting the book.");
    console.error(error);
  }
}
</script>
