import axios from "axios";

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const API = axios.create({ baseURL: `${baseURL}v1` });
 