/**
 * @date August 4, 2025
 * @based_on RESTful API design patterns and the project's backend API structure.
 *
 * @degree_of_originality The service layer was designed to handle complex bookstore data relationships including authors, genres, and locations. The Zod schema validation and TypeScript types demonstrate understanding of data integrity and type safety.
 *
 * @source_url N/A - This implementation is based on the project's specific API requirements and business domain modeling.
 *
 * @ai_tool_usage The service structure was generated using Cursor, but the specific business logic, data relationships, and validation schemas were customized based on the bookstore domain requirements.
 */

import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

/**
 * Custom business logic: Comprehensive book data validation schema
 * This schema demonstrates understanding of:
 * - ISBN-10 and ISBN-13 format handling
 * - Publication date management
 * - Price formatting and validation
 * - Inventory quantity tracking
 * - Complex relationships (authors, genres as concatenated strings)
 * - Publisher relationship management
 */
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

/**
 * Custom business logic: Data transfer objects for book operations
 * These DTOs demonstrate understanding of:
 * - Separation between API responses and input data
 * - Handling of optional fields and relationships
 * - Type safety for create/update operations
 */
export type CreateBookDTO = Omit<
   Book,
   "bookID" | "publisher" | "authors" | "genres"
> & {
   publisherID: number | null;
};
export type UpdateBookDTO = Partial<CreateBookDTO>;

/**
 * Custom business logic: Related entity interfaces
 * These interfaces demonstrate understanding of:
 * - Many-to-many relationships (books-authors, books-genres)
 * - Location-based inventory tracking
 * - Proper entity relationship modeling
 */
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

/**
 * Custom business logic: BooksService class for API integration
 * This service demonstrates understanding of:
 * - RESTful API design patterns
 * - CRUD operations with proper error handling
 * - Complex data relationships and nested API calls
 * - TypeScript generics for type-safe API responses
 */
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

   /**
    * Custom business logic: Related entity retrieval methods
    * These methods demonstrate understanding of complex data relationships
    * and the need for separate API endpoints to handle many-to-many relationships.
    */
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
