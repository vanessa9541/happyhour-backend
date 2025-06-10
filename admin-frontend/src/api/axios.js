// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Mets ici l'adresse de ton backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
