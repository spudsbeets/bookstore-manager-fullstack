import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

export const LocationSchema = z.object({
   slocID: z.number(),
   slocName: z.string(),
});

export type Location = z.infer<typeof LocationSchema>;

export type CreateLocationDTO = Omit<Location, "slocID">;
export type UpdateLocationDTO = Partial<CreateLocationDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class LocationsService {
   getAll(): Promise<AxiosResponse<Location[]>> {
      return http.get("/locations");
   }

   get(id: number): Promise<AxiosResponse<Location>> {
      return http.get(`/locations/${id}`);
   }

   create(data: CreateLocationDTO): Promise<AxiosResponse<Location>> {
      return http.post("/locations", data);
   }

   update(
      id: number,
      data: UpdateLocationDTO
   ): Promise<AxiosResponse<Location>> {
      return http.put(`/locations/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/locations/${id}`);
   }
}

export default new LocationsService();
