import http from "./http-common";

class LocationsService {
  getAll() {
    return http.get("/locations");
  }

  get(id) {
    return http.get(`/locations/${id}`);
  }

  create(data) {
    return http.post("/locations", data);
  }

  update(id, data) {
    return http.put(`/locations/${id}`, data);
  }

  remove(id) {
    return http.delete(`/locations/${id}`);
  }
}

export default new LocationsService(); 