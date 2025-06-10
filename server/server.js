// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const mealRoutes = require('./routes/mealRoutes');
const orderRoutes = require('./routes/orderRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const deleteOldOrders = require('./utils/cleanupOldOrders');

const app = express();
const path= require('path');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attacher io dans app pour l'utiliser dans les routes
app.set('io', io);

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());

// 👉 Corrigé ici : permet d'accéder aux fichiers du dossier 'uploads'
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Attacher io à chaque requête
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch((err) => console.error('❌ Erreur MongoDB :', err));

// Lancer la suppression toutes les heures (ou toutes les 10 minutes pendant les tests)
setInterval(deleteOldOrders, 60 * 60 * 1000); // toutes les heures

// Définir les routes
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes);

app.get('/',(req,res) => {
res.send('Bienvenue sur la base de données HAPPYHOUR');
});

// Socket.IO : écoute de connexion
io.on('connection', (socket) => {
  console.log('🟢 Admin connecté au socket');

  socket.on('disconnect', () => {
    console.log('🔴 Admin déconnecté du socket');
  });
});

// Lancer le serveur
const PORT = 7000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});
