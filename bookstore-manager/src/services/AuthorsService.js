import http from "./http-common";

class AuthorsService {
  getAll() {
    return http.get("/authors");
  }

  get(id) {
    return http.get(`/authors/${id}`);
  }

  create(data) {
    return http.post("/authors", data);
  }

  update(id, data) {
    return http.put(`/authors/${id}`, data);
  }

  remove(id) {
    return http.delete(`/authors/${id}`);
  }
}

export default new AuthorsService(); 