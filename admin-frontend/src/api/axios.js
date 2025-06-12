// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://happyhour-backend.onrender.com/api', // Mets ici l'adresse de ton backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
