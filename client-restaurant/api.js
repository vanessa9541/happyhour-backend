// client-restaurant/api.js
import axios from 'axios';

const api= axios.create({
  baseURL: 'http://172.20.10.6:7000', // Remplace par ton IP locale si nécessaire
  //headers: {
    //'Content-Type': 'application/json',
  //},
});

export default api;
