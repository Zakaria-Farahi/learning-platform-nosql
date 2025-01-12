// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : en utilisant les fonctions de cacheData
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : les clés Redis doivent être uniques et significatives
const db = require('../config/db');

const DEFAULT_TTL = 3600;


const handleRedisError = (error, operation) => {
  console.error(`Redis ${operation} error:`, error);
  throw new Error(`Cache error during ${operation}: ${error.message}`);
};
// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl=DEFAULT_TTL) {
    // TODO: Implémenter une fonction générique de cache
  try {
    const dataStrings = JSON.stringify(data);
    await db.getRedisClient().setEx(key, ttl, dataStrings);
    return true;
  } catch (error) {
    handleRedisError(error, 'cacheData');
  }
  }

async function getCachedData(key) {
  try {
    const data = await db.getRedisClient().get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    handleRedisError(error, 'getCachedData');
  }
}

async function removeCachedData(key) {
  try {
    await db.getRedisClient().del(key);
    return true;
  } catch (error) {
    handleRedisError(error, 'removeCachedData');
  }
}

  module.exports = {
    // TODO: Exporter les fonctions utilitaires
    cacheData,
    getCachedData,
    removeCachedData,
  };