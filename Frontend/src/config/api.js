import axios from "axios";

export const AUTH_BASE_URL = "http://localhost:3000/api/auth";
export const MUSIC_BASE_URL = "http://localhost:3002/api/music";

export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
});

export const musicApi = axios.create({
  baseURL: MUSIC_BASE_URL,
  withCredentials: true,
});

