// client-restaurant/api.js
import axios from 'axios';

const api= axios.create({
  baseURL: 'https://happyhour-backend.onrender.com/api' , // Remplace par ton IP locale si nécessaire
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
