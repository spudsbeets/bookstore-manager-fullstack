import http from "./http-common";

class BookGenresService {
  getAll() {
    return http.get("/book-genres");
  }

  get(id) {
    return http.get(`/book-genres/${id}`);
  }

  create(data) {
    return http.post("/book-genres", data);
  }

  update(id, data) {
    return http.put(`/book-genres/${id}`, data);
  }

  remove(id) {
    return http.delete(`/book-genres/${id}`);
  }
}

export default new BookGenresService(); 