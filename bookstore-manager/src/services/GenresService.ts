import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

export const GenreSchema = z.object({
   genreID: z.number(),
   genreName: z.string(),
});

export type Genre = z.infer<typeof GenreSchema>;

export type CreateGenreDTO = Omit<Genre, "genreID">;
export type UpdateGenreDTO = Partial<CreateGenreDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class GenresService {
   getAll(): Promise<AxiosResponse<Genre[]>> {
      return http.get("/genres");
   }

   get(id: number): Promise<AxiosResponse<Genre>> {
      return http.get(`/genres/${id}`);
   }

   create(data: CreateGenreDTO): Promise<AxiosResponse<Genre>> {
      return http.post("/genres", data);
   }

   update(id: number, data: UpdateGenreDTO): Promise<AxiosResponse<Genre>> {
      return http.put(`/genres/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/genres/${id}`);
   }
}

export default new GenresService();
