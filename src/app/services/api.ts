import axios from "axios";

export const baseURL = process.env.NEXT_PUBLIC_API_URL || '188.166.245.108/api/';

export const API = axios.create({ baseURL: `${'http://188.166.245.108/api/'}v1` });
 