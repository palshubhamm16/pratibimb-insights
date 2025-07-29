import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Axios instance 
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Helper to build query string
const buildQuery = (start, end) => {
    return start && end ? `?start=${start}&end=${end}` : "";
};

export async function fetchStateSummary(state, start, end) {
    const res = await api.get(`/states/${state}/summary${buildQuery(start, end)}`);
    return res.data;
}

export async function fetchTopDistricts(state, start, end) {
    const res = await api.get(`/states/${state}/top-districts${buildQuery(start, end)}`);
    return res.data;
}

export async function fetchCategoryDistribution(state, start, end) {
    const res = await api.get(`/states/${state}/category-distribution${buildQuery(start, end)}`);
    return res.data;
}

export async function fetchTrendData(state, start, end) {
    const res = await api.get(`/states/${state}/trends${buildQuery(start, end)}`);
    return res.data;
}

export async function fetchTopDays(state, start, end) {
    const res = await api.get(`/states/${state}/top-days${buildQuery(start, end)}`);
    return res.data;
}

export async function fetchTopSuspects(state, start, end) {
    const res = await api.get(`/states/${state}/top-suspects${buildQuery(start, end)}`);
    return res.data;

}

export async function fetchVictimMapping(state, start, end) {
  const res = await api.get(`/states/${state}/victim-mapping${buildQuery(start, end)}`);
  return res.data;
}