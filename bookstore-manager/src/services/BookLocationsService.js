import http from "./http-common";

class BookLocationsService {
  getAll() {
    return http.get("/book-locations");
  }

  get(id) {
    return http.get(`/book-locations/${id}`);
  }

  create(data) {
    return http.post("/book-locations", data);
  }

  update(id, data) {
    return http.put(`/book-locations/${id}`, data);
  }

  remove(id) {
    return http.delete(`/book-locations/${id}`);
  }
}

export default new BookLocationsService(); 