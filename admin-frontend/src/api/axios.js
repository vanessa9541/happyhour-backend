// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7000/api', // Mets ici l'adresse de ton backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
