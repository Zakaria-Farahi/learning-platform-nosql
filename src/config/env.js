// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : pour eviter les erreurs de configuration
// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : le programme ne fonctionnera pas

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  // TODO: Implémenter la validation
  // Si une variable manque, lever une erreur explicative
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
        throw new Error(`La variable d'environnement ${envVar} est manquante`);
        }
        else
          console.log("Your Good To Go")
    });
}

validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};