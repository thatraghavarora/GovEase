import axios from "axios";

const apiBaseUrl = `${window.location.origin}/api`;

const API = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
});

export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);
export const loginAdmin = (data) => API.post("/admin/login", data);
export const registerAdmin = (data) => API.post("/admin/register", data);
export const createToken = (data) => API.post("/tokens", data);
export const fetchTokens = (params) => API.get("/tokens", { params });
export const fetchAdminTokens = (params) => API.get("/admin/tokens", { params });
export const approveToken = (tokenId) => API.patch(`/admin/tokens/${tokenId}/approve`);
export const rejectToken = (tokenId) => API.patch(`/admin/tokens/${tokenId}/reject`);
export const clearToken = (tokenId) => API.patch(`/admin/tokens/${tokenId}/clear`);
export const fetchAdminQrs = (params) => API.get("/admin/qrs", { params });
export const createAdminQrs = (data) => API.post("/admin/qrs", data);
export const toggleAdminQr = (code) => API.patch(`/admin/qrs/${code}/toggle`);
export const fetchQrStatus = (code) => API.get(`/qr/${code}`);
