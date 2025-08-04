import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

export const OrderItemSchema = z.object({
   orderItemID: z.number(),
   orderID: z.number(),
   bookID: z.number(),
   quantity: z.number(),
   individualPrice: z.number(),
   subtotal: z.number(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export type CreateOrderItemDTO = Omit<OrderItem, "orderItemID">;
export type UpdateOrderItemDTO = Partial<CreateOrderItemDTO>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class OrderItemsService {
   getAll(): Promise<AxiosResponse<OrderItem[]>> {
      return http.get("/order-items");
   }

   get(id: number): Promise<AxiosResponse<OrderItem>> {
      return http.get(`/order-items/${id}`);
   }

   getByOrderId(orderId: number): Promise<AxiosResponse<OrderItem[]>> {
      return http.get(`/order-items/order/${orderId}`);
   }

   create(data: CreateOrderItemDTO): Promise<AxiosResponse<OrderItem>> {
      return http.post("/order-items", data);
   }

   update(
      id: number,
      data: UpdateOrderItemDTO
   ): Promise<AxiosResponse<OrderItem>> {
      return http.put(`/order-items/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/order-items/${id}`);
   }
}

export default new OrderItemsService();
