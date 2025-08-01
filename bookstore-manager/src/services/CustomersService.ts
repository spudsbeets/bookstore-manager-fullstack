import http from "./http-common";
import { z } from "zod";
import type { AxiosResponse } from "axios";

// -----------------------------
// ZOD SCHEMA & TYPES
// -----------------------------

export const CustomerSchema = z.object({
   customerID: z.number(),
   firstName: z.string(),
   lastName: z.string(),
   email: z.string().email().nullable(),
   phoneNumber: z.string().length(10).nullable(),
});

export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomerDTO = Omit<Customer, "customerID">;
export type UpdateCustomerDTO = Partial<CreateCustomerDTO>;

// Optional: shape for customer's orders
export const CustomerOrderSchema = z.object({
   orderID: z.number(),
   orderDate: z.string(),
   orderTime: z.string(),
   total: z.number(),
   taxRate: z.number(),
   salesRateID: z.number(),
});

export type CustomerOrder = z.infer<typeof CustomerOrderSchema>;

// -----------------------------
// SERVICE CLASS
// -----------------------------

class CustomersService {
   getAll(): Promise<AxiosResponse<Customer[]>> {
      return http.get("/customers");
   }

   get(id: number): Promise<AxiosResponse<Customer>> {
      return http.get(`/customers/${id}`);
   }

   create(data: CreateCustomerDTO): Promise<AxiosResponse<Customer>> {
      return http.post("/customers", data);
   }

   update(
      id: number,
      data: UpdateCustomerDTO
   ): Promise<AxiosResponse<Customer>> {
      return http.put(`/customers/${id}`, data);
   }

   remove(id: number): Promise<AxiosResponse<void>> {
      return http.delete(`/customers/${id}`);
   }

   getOrders(customerId: number): Promise<AxiosResponse<CustomerOrder[]>> {
      return http.get(`/customers/${customerId}/orders`);
   }
}

export default new CustomersService();
