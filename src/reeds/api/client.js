import axios from "axios";

const api = axios.create({
  baseURL: "",
  timeout: 60_000,
});

export async function health() {
  const { data } = await api.get("/api/health");
  return data;
}

export async function searchListings(params) {
  const { data } = await api.get("/api/zillow/search", { params });
  return data;
}

export async function searchByCoordinates(params) {
  const { data } = await api.get("/api/zillow/search-coordinates", { params });
  return data;
}

export async function getPropertyDetails(params) {
  const { data } = await api.get("/api/zillow/property-details", { params });
  return data;
}

export async function getZestimate(params) {
  const { data } = await api.get("/api/zillow/zestimate", { params });
  return data;
}
