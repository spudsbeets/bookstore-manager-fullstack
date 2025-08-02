import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TS INTERFACES
// -----------------------------

export const BookAuthorSchema = z.object({
   bookAuthorID: z.number(),
   title: z.string(),
   author: z.string(),
});

export type BookAuthor = z.infer<typeof BookAuthorSchema>;

export type CreateBookAuthorDTO = {
   bookID: number;
   authorID: number;
};
export type UpdateBookAuthorDTO = Partial<CreateBookAuthorDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class BookAuthorsService {
   getAll(): Promise<AxiosResponse<BookAuthor[]>> {
      return http.get("/book-authors");
   }

   get(id: number): Promise<AxiosResponse<BookAuthor>> {
      return http.get(`/book-authors/${id}`);
   }

   create(data: CreateBookAuthorDTO): Promise<AxiosResponse<BookAuthor>> {
      return http.post("/book-authors", data);
   }

   update(
      id: number,
      data: UpdateBookAuthorDTO
   ): Promise<AxiosResponse<BookAuthor>> {
      return http.put(`/book-authors/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/book-authors/${id}`);
   }

   getByBookId(bookId: number): Promise<AxiosResponse<BookAuthor[]>> {
      return http.get(`/book-authors/book/${bookId}`);
   }

   getBooksForDropdown(): Promise<AxiosResponse<any[]>> {
      return http.get("/book-authors/books/dropdown");
   }

   getAuthorsForDropdown(): Promise<AxiosResponse<any[]>> {
      return http.get("/book-authors/authors/dropdown");
   }
}

export default new BookAuthorsService();
