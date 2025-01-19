import axios from "axios";

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/';

export const API = axios.create({ baseURL: baseURL+'v1' });
