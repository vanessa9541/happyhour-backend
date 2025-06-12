import { io } from 'socket.io-client';

const socket = io('https://happyhour-backend.onrender.com'); // ← adapte le port si besoin
export default socket;