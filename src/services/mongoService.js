// Question: Pourquoi créer des services séparés ?
// Réponse: pour faciliter la réutilisation et la gestion des connexions

const { ObjectId } = require('mongodb');
const db = require('../config/db');

// Utility function to validate MongoDB ID
const isValidObjectId = (id) => ObjectId.isValid(id);

// Generic error handler for MongoDB operations
const handleMongoError = (error, operation) => {
    console.error(`MongoDB ${operation} error:`, error);
    throw new Error(`Database error during ${operation}: ${error.message}`);
};
// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  // TODO: Implémenter une fonction générique de recherche par ID
    try {
        if (!isValidObjectId(id)) {
            throw new Error('Invalid MongoDB ObjectId provided');
        }

        const result = await db.getMongoDb()
            .collection(collection)
            .findOne({ _id: new ObjectId(id) });

        return result;
    } catch (error) {
        handleMongoError(error, 'findOneById');
    }
}

async function insertOne(collection, document) {
    try {
        const result = await db.getMongoDb()
            .collection(collection)
            .insertOne(document);

        return result;
    } catch (error) {
        handleMongoError(error, 'insertOne');
    }
}

// Export des services
module.exports = {
  // TODO: Exporter les fonctions utilitaires
    findOneById,
    insertOne
};