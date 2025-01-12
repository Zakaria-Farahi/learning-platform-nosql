// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : faciliter la réutilisation et la gestion des connexions
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : ajouter fonction close() pour fermer les connexions

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;

async function connectMongo(retry = 0) {
  // TODO: Implémenter la connexion MongoDB
    try {
        mongoClient = new MongoClient(config.mongodb.uri, {
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        await mongoClient.connect();
        db = mongoClient.db(config.mongodb.dbName);
        console.log('Connected to MongoDB');
        return db;
    } catch(e) {
        // Gérer les erreurs et les retries
        console.error('Failed to connect to MongoDB', e);
        if (retry < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_INTERVAL}ms...`);
            setTimeout(() => connectMongo(retry + 1), RETRY_INTERVAL);
        }
    }
}

async function connectRedis(retry = 0) {
  // TODO: Implémenter la connexion Redis
    try{
        redisClient = redis.createClient(config.redis.uri);
        redisClient.on('error', (error) => {
            console.error('Redis connection error:', error);
        });

        redisClient.on('connect', () => {
            console.log('Redis connection established successfully');
        });

        redisClient.on('reconnecting', () => {
            console.log('Redis client reconnecting...');
        });

        await redisClient.connect();
        return redisClient;
    } catch (e) {
        // Gérer les erreurs et les retries
        console.error('Failed to connect to Redis', e);
        if (retry < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_INTERVAL}ms...`);
            setTimeout(() => connectRedis(retry + 1), RETRY_INTERVAL);
        }
    }
}


async function closeConnections() {
    try {
        if(mongoClient) {
            await mongoClient.close();
            console.log('MongoDB connection closed');
        }

        if(redisClient) {
            await redisClient.quit();
            console.log('Redis connection closed');
        }
    } catch (e) {
        console.error('Failed to close connections', e);
    }
}

async function initializeConnections() {
    try {
        const [mongoDb, redisDb] = await Promise.all([
            connectMongo(),
            connectRedis()
        ]);

        return { mongoDb, redisDb };
    } catch (error) {
        console.error('Failed to initialize database connections:', error);
        throw error;
    }
}
// Export des fonctions et clients
module.exports = {
  // TODO: Exporter les clients et fonctions utiles
    initializeConnections,
    closeConnections,
    getMongoDb: () => db,
    getRedisClient: () => redisClient
};