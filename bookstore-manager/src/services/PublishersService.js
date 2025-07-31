import http from "./http-common";

class PublishersService {
   getAll() {
      return http.get("/publishers");
   }

   get(id) {
      return http.get(`/publishers/${id}`);
   }

   create(data) {
      return http.post("/publishers", data);
   }

   update(id, data) {
      return http.put(`/publishers/${id}`, data);
   }

   remove(id) {
      return http.delete(`/publishers/${id}`);
   }
}

export default new PublishersService();
