export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);

  try {
    await prisma.book.delete({ where: { id } });
    return { message: "Book deleted successfully" };
  } catch (error) {
    console.error("Delete error:", error);
    throw createError({ statusCode: 500, message: "Failed to delete book" });
  }
});
