import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TS INTERFACES
// -----------------------------

export const BookLocationSchema = z.object({
   bookLocationID: z.number(),
   bookID: z.number(),
   slocID: z.number(),
   quantity: z.number().min(0),
});

export type BookLocation = z.infer<typeof BookLocationSchema>;

export type CreateBookLocationDTO = Omit<BookLocation, "bookLocationID">;
export type UpdateBookLocationDTO = Partial<CreateBookLocationDTO>;

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
}

export default new BookLocationsService();
