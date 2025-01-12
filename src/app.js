// Question: Comment organiser le point d'entrée de l'application ?
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?

const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');
//const studentRoutes = require('./routes/studentRoutes');

const app = express();

async function startServer() {
  try {
    // TODO: Initialiser les connexions aux bases de données
    db.initializeConnections();
    // TODO: Configurer les middlewares Express
    app.use(express.json());
    // TODO: Monter les routes
    app.use('/api/courses', courseRoutes);
    // TODO: Démarrer le serveur
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  // TODO: Implémenter la fermeture propre des connexions
    try {
        await db.closeConnections();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (e) {
        console.error('Failed to close MongoDB connection:', e);
        process.exit(1);
    }
});

startServer();