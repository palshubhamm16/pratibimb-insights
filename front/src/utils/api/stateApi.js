import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Build query string with start, end, and categories
const buildQuery = (start, end, categories = []) => {
    const params = new URLSearchParams();
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    categories.forEach((cat) => params.append("categories", cat));
    return `?${params.toString()}`;
};

// API functions with category support
export async function fetchStateSummary(state, start, end, categories = []) {
    const res = await api.get(`/states/${state}/summary${buildQuery(start, end, categories)}`);
    return res.data;
}

export async function fetchTopDistricts(state, start, end, categories = []) {
    const res = await api.get(`/states/${state}/top-districts${buildQuery(start, end, categories)}`);
    return res.data;
}

export async function fetchCategoryDistribution(state, start, end, categories = []) {
    const res = await api.get(`/states/${state}/category-distribution${buildQuery(start, end, categories)}`);
    return res.data;
}

export async function fetchTrendData(state, start, end, categories = []) {
    const res = await api.get(`/states/${state}/trends${buildQuery(start, end, categories)}`);
    return res.data;
}

export async function fetchTopDays(state, start, end, categories = []) {
    const res = await api.get(`/states/${state}/top-days${buildQuery(start, end, categories)}`);
    return res.data;
}

export async function fetchTopSuspects(state, start, end, categories = []) {
    const res = await api.get(`/states/${state}/top-suspects${buildQuery(start, end, categories)}`);
    return res.data;
}

export async function fetchVictimMapping(state, start, end, categories = []) {
    const res = await api.get(`/states/${state}/victim-mapping${buildQuery(start, end, categories)}`);
    return res.data;
}
