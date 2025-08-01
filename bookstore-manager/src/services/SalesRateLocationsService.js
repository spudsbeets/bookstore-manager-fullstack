import http from "./http-common";

class SalesRateLocationsService {
   getAll() {
      return http.get("/sales-rates");
   }

   get(id) {
      return http.get(`/sales-rates/${id}`);
   }

   create(data) {
      return http.post("/sales-rates", data);
   }

   update(id, data) {
      return http.put(`/sales-rates/${id}`, data);
   }

   remove(id) {
      return http.delete(`/sales-rates/${id}`);
   }
}

export default new SalesRateLocationsService();
