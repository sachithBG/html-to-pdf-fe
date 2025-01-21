import axios from "axios";

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const API = axios.create({
    baseURL: `${baseURL || "http://localhost:4000/api/"}v1`,
    timeout: 30000, // Optional: 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
 });
 