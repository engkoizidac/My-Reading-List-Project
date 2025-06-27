export default defineEventHandler(async (event) => {
  const books = await prisma.book.findMany();
  return books;
});
