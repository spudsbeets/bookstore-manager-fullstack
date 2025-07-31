import http from "./http-common";

class GenresService {
   getAll() {
      return http.get("/genres");
   }

   get(id) {
      return http.get(`/genres/${id}`);
   }

   create(data) {
      return http.post("/genres", data);
   }

   update(id, data) {
      return http.put(`/genres/${id}`, data);
   }

   remove(id) {
      return http.delete(`/genres/${id}`);
   }
}

export default new GenresService();
