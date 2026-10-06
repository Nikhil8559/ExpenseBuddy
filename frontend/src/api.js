import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const createExpense = (data) => api.post("/expenses", data);
export const listExpenses = (params) => api.get("/expenses", { params });
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const getSummary = () => api.get("/expenses/summary");
