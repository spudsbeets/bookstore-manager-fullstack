import http from "./http-common";

class BooksService {
  getAll() {
    return http.get("/books");
  }

  get(id) {
    return http.get(`/books/${id}`);
  }

  create(data) {
    return http.post("/books", data);
  }

  update(id, data) {
    return http.put(`/books/${id}`, data);
  }

  remove(id) {
    return http.delete(`/books/${id}`);
  }

  getAuthors(bookId) {
    return http.get(`/books/${bookId}/authors`);
  }

  getGenres(bookId) {
    return http.get(`/books/${bookId}/genres`);
  }

  getLocations(bookId) {
    return http.get(`/books/${bookId}/locations`);
  }
}

export default new BooksService(); 