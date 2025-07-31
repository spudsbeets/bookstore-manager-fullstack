import http from "./http-common";

class CustomersService {
  getAll() {
    return http.get("/customers");
  }

  get(id) {
    return http.get(`/customers/${id}`);
  }

  create(data) {
    return http.post("/customers", data);
  }

  update(id, data) {
    return http.put(`/customers/${id}`, data);
  }

  remove(id) {
    return http.delete(`/customers/${id}`);
  }

  getOrders(customerId) {
    return http.get(`/customers/${customerId}/orders`);
  }
}

export default new CustomersService(); 