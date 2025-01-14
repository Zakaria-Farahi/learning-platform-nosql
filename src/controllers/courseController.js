// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Un contrôleur contient la logique métier par contre route définit les points d'entrée de l'API.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : pour rendre le code plus modulaire

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

async function createCourse(req, res) {
  // TODO: Implémenter la création d'un cours
  // Utiliser les services pour la logique réutilisable
    try {
        const course = req.body;

        course.createdAt = new Date();
        course.status = 'active';

        const result = await mongoService.insertOne('courses', course);
        res.json(result);
        const cacheKey = `course:${result.insertedId}`;
        await redisService.cacheData(cacheKey, course);
    } catch (e) {
        console.error('Failed to create course', e);
    }
}

async function getCourse(req, res) {
    try {
        const courseId = req.params.id;
        const cacheKey = `course:${courseId}`;

        const cachedCourse = await redisService.getCachedData(cacheKey);
        if (cachedCourse) {
            return res.json(cachedCourse);
        }

        const course = await mongoService.findOneById('courses', courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        await redisService.cacheData(cacheKey, course);
        res.json(course);
    } catch (e) {
        console.error('Failed to get course', e);
    }
}

async function getAllCourses(req, res) {
    try {
        const courses = await db.getMongoDb().collection('courses').find().toArray();
        res.json(courses);
    } catch (e) {
        console.error('Failed to get all courses', e);
    }
}

async function getCourseStats(req, res) {
   try {
       const cachedStats = await redisService.getCachedData('courseStats');
         if (cachedStats) {
              return res.json(cachedStats);
         }
         const pipeline = [
             {
                 $group: {
                     _id: null,
                     totalCourses: { $sum: 1 }
                 }
             }
         ]
       const stats = await db.getMongoDb().aggregate('courses', pipeline);
         const result = stats[0] || { totalCourses: 0 };
       await redisService.cacheData('courseStats', result);
            res.json(result);
   } catch (e) {
         console.error('Failed to get course stats', e);
   }
}

// Export des contrôleurs
module.exports = {
  // TODO: Exporter les fonctions du contrôleur
    createCourse,
    getCourse,
    getAllCourses,
    getCourseStats
};