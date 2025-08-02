import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

// This is what the backend actually returns
export const BookSchema = z.object({
   bookID: z.number(),
   publicationDate: z.string(),
   "isbn-10": z.string().nullable(),
   "isbn-13": z.string().nullable(),
   price: z.string(),
   inventoryQty: z.number(),
   title: z.string(),
   publisher: z.string().nullable(),
   authors: z.string().nullable(),
   genres: z.string().nullable(),
});

export type Book = z.infer<typeof BookSchema>;

export type CreateBookDTO = Omit<
   Book,
   "bookID" | "publisher" | "authors" | "genres"
> & {
   publisherID: number | null;
};
export type UpdateBookDTO = Partial<CreateBookDTO>;

// Optionally define types for related endpoints:
export interface BookAuthor {
   authorID: number;
   fullName: string;
}

export interface BookGenre {
   genreID: number;
   genreName: string;
}

export interface BookLocation {
   bookLocationID: number;
   slocID: number;
   slocName: string;
   quantity: number;
}

// -----------------------------
// SERVICE CLASS
// -----------------------------

class BooksService {
   getAll(): Promise<AxiosResponse<Book[]>> {
      return http.get("/books");
   }

   get(id: number): Promise<AxiosResponse<Book>> {
      return http.get(`/books/${id}`);
   }

   create(data: CreateBookDTO): Promise<AxiosResponse<Book>> {
      return http.post("/books", data);
   }

   update(id: number, data: UpdateBookDTO): Promise<AxiosResponse<Book>> {
      return http.put(`/books/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/books/${id}`);
   }

   getAuthors(bookId: number): Promise<AxiosResponse<BookAuthor[]>> {
      return http.get(`/books/${bookId}/authors`);
   }

   getGenres(bookId: number): Promise<AxiosResponse<BookGenre[]>> {
      return http.get(`/books/${bookId}/genres`);
   }

   getLocations(bookId: number): Promise<AxiosResponse<BookLocation[]>> {
      return http.get(`/books/${bookId}/locations`);
   }
}

export default new BooksService();
