import { io } from 'socket.io-client';

const socket = io('http://172.20.10.6:7000'); // ← adapte le port si besoin
export default socket;