// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : en utilisant les fonctions de cacheData
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : les clés Redis doivent être uniques et significatives
const db = require('../config/db');

const DEFAULT_TTL = 3600;

const createCacheKey = (prefix, identifier) => {
  return `${prefix}:${identifier}`.toLowerCase();
};

const handleRedisError = (error, operation) => {
  console.error(`Redis ${operation} error:`, error);
  throw new Error(`Cache error during ${operation}: ${error.message}`);
};
// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl) {
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

async function removeAndCacheData(key, data, ttl) {
    try {
        await removeCachedData(key);
        await cacheData(key, data, ttl);
        return true;
    } catch (error) {
        handleRedisError(error, 'removeAndCacheData');
    }
}

async function runTest() {
  db.initializeConnections();
    const key = createCacheKey('test', '123');
    const data = { name: 'TesttoTry' };
    const ttl = 5;

    await cacheData(key, data, ttl);
    const cachedData = await getCachedData(key);
    console.log('Cached data:', cachedData);

    await removeCachedData(key);
    const removedData = await getCachedData(key);
    console.log('Removed data:', removedData);
}

runTest();
  module.exports = {
    // TODO: Exporter les fonctions utilitaires
    cacheData,
    getCachedData,
    removeCachedData,
    removeAndCacheData
  };