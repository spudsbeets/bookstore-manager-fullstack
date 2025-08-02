import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

export const BookGenreSchema = z.object({
   bookGenreID: z.number(),
   title: z.string(),
   genre: z.string(),
});

export type BookGenre = z.infer<typeof BookGenreSchema>;

export type CreateBookGenreDTO = {
   bookID: number;
   genreID: number;
};
export type UpdateBookGenreDTO = Partial<CreateBookGenreDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class BookGenresService {
   getAll(): Promise<AxiosResponse<BookGenre[]>> {
      return http.get("/book-genres");
   }

   get(id: number): Promise<AxiosResponse<BookGenre>> {
      return http.get(`/book-genres/${id}`);
   }

   create(data: CreateBookGenreDTO): Promise<AxiosResponse<BookGenre>> {
      return http.post("/book-genres", data);
   }

   update(
      id: number,
      data: UpdateBookGenreDTO
   ): Promise<AxiosResponse<BookGenre>> {
      return http.put(`/book-genres/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/book-genres/${id}`);
   }

   getByBookId(bookId: number): Promise<AxiosResponse<BookGenre[]>> {
      return http.get(`/book-genres/book/${bookId}`);
   }

   getBooksForDropdown(): Promise<AxiosResponse<any[]>> {
      return http.get("/book-genres/books/dropdown");
   }

   getGenresForDropdown(): Promise<AxiosResponse<any[]>> {
      return http.get("/book-genres/genres/dropdown");
   }

   updateForBook(
      bookId: number,
      genreIds: number[]
   ): Promise<AxiosResponse<void>> {
      return http.put(`/book-genres/book/${bookId}`, { genreIds });
   }
}

export default new BookGenresService();
