import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TS INTERFACES
// -----------------------------

export const AuthorSchema = z.object({
   authorID: z.number(),
   firstName: z.string(),
   middleName: z.string().nullable(),
   lastName: z.string().nullable(),
   fullName: z.string(), // auto-generated field in DB
});

export type Author = z.infer<typeof AuthorSchema>;
export type CreateAuthorDTO = Omit<Author, "authorID" | "fullName">;
export type UpdateAuthorDTO = Partial<CreateAuthorDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class AuthorsService {
   getAll(): Promise<AxiosResponse<Author[]>> {
      return http.get("/authors");
   }

   get(id: number): Promise<AxiosResponse<Author>> {
      return http.get(`/authors/${id}`);
   }

   create(data: CreateAuthorDTO): Promise<AxiosResponse<Author>> {
      return http.post("/authors", data);
   }

   update(id: number, data: UpdateAuthorDTO): Promise<AxiosResponse<Author>> {
      return http.put(`/authors/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/authors/${id}`);
   }
}

export default new AuthorsService();
