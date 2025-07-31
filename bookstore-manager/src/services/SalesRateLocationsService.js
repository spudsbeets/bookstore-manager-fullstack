import http from "./http-common";

class SalesRateLocationsService {
  getAll() {
    return http.get("/sales-rate-locations");
  }

  get(id) {
    return http.get(`/sales-rate-locations/${id}`);
  }

  create(data) {
    return http.post("/sales-rate-locations", data);
  }

  update(id, data) {
    return http.put(`/sales-rate-locations/${id}`, data);
  }

  remove(id) {
    return http.delete(`/sales-rate-locations/${id}`);
  }
}

export default new SalesRateLocationsService(); 