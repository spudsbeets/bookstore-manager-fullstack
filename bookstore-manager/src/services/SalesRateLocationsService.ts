import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

export const SalesRateLocationSchema = z.object({
   salesRateID: z.number(),
   location: z.string(),
   taxRate: z.string(),
});

export type SalesRateLocation = z.infer<typeof SalesRateLocationSchema>;

export type CreateSalesRateLocationDTO = Omit<SalesRateLocation, "salesRateID">;
export type UpdateSalesRateLocationDTO = Partial<CreateSalesRateLocationDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class SalesRateLocationsService {
   getAll(): Promise<AxiosResponse<SalesRateLocation[]>> {
      return http.get("/sales-rates");
   }

   get(id: number): Promise<AxiosResponse<SalesRateLocation>> {
      return http.get(`/sales-rates/${id}`);
   }

   create(
      data: CreateSalesRateLocationDTO
   ): Promise<AxiosResponse<SalesRateLocation>> {
      return http.post("/sales-rates", data);
   }

   update(
      id: number,
      data: UpdateSalesRateLocationDTO
   ): Promise<AxiosResponse<SalesRateLocation>> {
      return http.put(`/sales-rates/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/sales-rates/${id}`);
   }
}

export default new SalesRateLocationsService();
