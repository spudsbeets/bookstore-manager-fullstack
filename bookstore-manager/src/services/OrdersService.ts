import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

export const OrderSchema = z.object({
   orderID: z.number(),
   orderDate: z.string(), // expect YYYY-MM-DD
   orderTime: z.string(), // expect HH:MM:SS
   total: z.number(),
   taxRate: z.number(),
   customerID: z.number(),
   salesRateID: z.number(),
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderDTO = Omit<Order, "orderID">;
export type UpdateOrderDTO = Partial<CreateOrderDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class OrdersService {
   getAll(): Promise<AxiosResponse<Order[]>> {
      return http.get("/orders");
   }

   get(id: number): Promise<AxiosResponse<Order>> {
      return http.get(`/orders/${id}`);
   }

   create(data: CreateOrderDTO): Promise<AxiosResponse<Order>> {
      return http.post("/orders", data);
   }

   update(id: number, data: UpdateOrderDTO): Promise<AxiosResponse<Order>> {
      return http.put(`/orders/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/orders/${id}`);
   }
}

export default new OrdersService();
