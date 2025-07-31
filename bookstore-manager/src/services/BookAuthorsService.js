import http from "./http-common";

class BookAuthorsService {
  getAll() {
    return http.get("/book-authors");
  }

  get(id) {
    return http.get(`/book-authors/${id}`);
  }

  create(data) {
    return http.post("/book-authors", data);
  }

  update(id, data) {
    return http.put(`/book-authors/${id}`, data);
  }

  remove(id) {
    return http.delete(`/book-authors/${id}`);
  }
}

export default new BookAuthorsService(); 