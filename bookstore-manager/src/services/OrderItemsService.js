import http from "./http-common";

class OrderItemsService {
  getAll() {
    return http.get("/order-items");
  }

  get(id) {
    return http.get(`/order-items/${id}`);
  }

  getByOrderId(orderId) {
    return http.get(`/order-items?orderId=${orderId}`);
  }

  create(data) {
    return http.post("/order-items", data);
  }

  update(id, data) {
    return http.put(`/order-items/${id}`, data);
  }

  remove(id) {
    return http.delete(`/order-items/${id}`);
  }
}

export default new OrderItemsService(); 