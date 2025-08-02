import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TS INTERFACES
// -----------------------------

export const BookLocationSchema = z.object({
   bookLocationID: z.number(),
   slocName: z.string(),
   title: z.string(),
   quantity: z.number().min(0),
});

export type BookLocation = z.infer<typeof BookLocationSchema>;

export type CreateBookLocationDTO = {
   bookID: number;
   slocID: number;
   quantity: number;
};

export type UpdateBookLocationDTO = {
   bookID: number;
   slocID: number;
   quantity: number;
};

// -----------------------------
// SERVICE CLASS
// -----------------------------

class BookLocationsService {
   getAll(): Promise<AxiosResponse<BookLocation[]>> {
      return http.get("/book-locations");
   }

   get(id: number): Promise<AxiosResponse<BookLocation>> {
      return http.get(`/book-locations/${id}`);
   }

   create(data: CreateBookLocationDTO): Promise<AxiosResponse<BookLocation>> {
      return http.post("/book-locations", data);
   }

   update(
      id: number,
      data: UpdateBookLocationDTO
   ): Promise<AxiosResponse<BookLocation>> {
      return http.put(`/book-locations/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/book-locations/${id}`);
   }

   // Get book locations by book ID
   getByBookId(bookId: number): Promise<AxiosResponse<BookLocation[]>> {
      return http.get(`/book-locations/book/${bookId}`);
   }

   // Get all locations for dropdown
   getLocations(): Promise<AxiosResponse<any[]>> {
      return http.get("/locations");
   }

   // Get all books for dropdown
   getBooks(): Promise<AxiosResponse<any[]>> {
      return http.get("/books");
   }
}

export default new BookLocationsService();
