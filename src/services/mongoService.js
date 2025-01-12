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

async function runTests() {
    try {
        // Initialize connections
        await db.initializeConnections();
        console.log('Connected to MongoDB');

        // Insert a document
        const insertResult = await insertOne('users', { name: 'Alice', age: 30 });
        console.log('Insert Result:', insertResult);

        if (insertResult?.insertedId) {
            // Fetch the document by ID
            const fetchedDocument = await findOneById('users', insertResult.insertedId);
            console.log('Fetched Document:', fetchedDocument);

            // Verify the fetched document
            if (fetchedDocument?.name === 'Alice' && fetchedDocument?.age === 30) {
                console.log('Test Passed!');
            } else {
                console.error('Test Failed: Document mismatch');
            }
        } else {
            console.error('Test Failed: Document not inserted');
        }
    } catch (error) {
        console.error('Error during testing:', error);
    } finally {
        // Close all connections
        await db.closeConnections();
        console.log('Disconnected from MongoDB');
    }
}

runTests();
// Export des services
module.exports = {
  // TODO: Exporter les fonctions utilitaires
};