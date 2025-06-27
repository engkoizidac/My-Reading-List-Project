import { bookSchema } from "~/validations/book";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const result = bookSchema.safeParse(body);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: result.error.flatten(),
    });
  }

  // Access validated data
  const data = result.data;

  // Save to DB
  const newBook = await prisma.book.create({ data });
  return newBook;
});
