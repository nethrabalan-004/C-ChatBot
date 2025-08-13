import axios from "axios";

const API = axios.create({ baseURL: "/api" });

export const sendMessage = (userId, message) =>
  API.post("/chat", { userId, message });

export const getHistory = (userId) =>
  API.get("/history", { params: { userId } });
