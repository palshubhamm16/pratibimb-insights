import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// 🔧 Query builder utility
const buildQuery = (start, end, categories = []) => {
    const params = new URLSearchParams();
    if (start) params.append("start", start);
    if (end) params.append("end", end);
    categories.forEach((cat) => params.append("categories", cat));
    return `?${params.toString()}`;
};

// 📊 National Summary
export async function fetchNationalSummary(start, end, categories = []) {
    const res = await api.get(`/country/summary${buildQuery(start, end, categories)}`);
    return res.data;
}

// 🗺️ India Heatmap Data (Victim Mapping)
export async function fetchIndiaHeatmapData(start, end, categories = []) {
    const res = await api.get(`/country/heatmap${buildQuery(start, end, categories)}`);
    return res.data;
}

// 🏆 Top 10 Fraudster States
export async function fetchTopStates(start, end, categories = []) {
    const res = await api.get(`/country/top-states${buildQuery(start, end, categories)}`);
    return res.data;
}

export async function fetchNationalTrends(start, end, categories = []) {
    const res = await api.get(`/country/trends${buildQuery(start, end, categories)}`);
    return res.data || [];

}

export async function fetchNationalCategoryBreakdown(start, end, categories = []) {
    const res = await api.get(`/country/category-breakdown${buildQuery(start, end, categories)}`);
    return res.data || [];
}
