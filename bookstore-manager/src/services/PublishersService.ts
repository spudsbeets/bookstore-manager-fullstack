import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

export const PublisherSchema = z.object({
   publisherID: z.number(),
   publisherName: z.string(),
});

export type Publisher = z.infer<typeof PublisherSchema>;

export type CreatePublisherDTO = Omit<Publisher, "publisherID">;
export type UpdatePublisherDTO = Partial<CreatePublisherDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class PublishersService {
   getAll(): Promise<AxiosResponse<Publisher[]>> {
      return http.get("/publishers");
   }

   get(id: number): Promise<AxiosResponse<Publisher>> {
      return http.get(`/publishers/${id}`);
   }

   create(data: CreatePublisherDTO): Promise<AxiosResponse<Publisher>> {
      return http.post("/publishers", data);
   }

   update(
      id: number,
      data: UpdatePublisherDTO
   ): Promise<AxiosResponse<Publisher>> {
      return http.put(`/publishers/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/publishers/${id}`);
   }
}

export default new PublishersService();
