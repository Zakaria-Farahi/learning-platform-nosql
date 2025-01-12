// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : pour organiser et structurer le code
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: par fonctionnalité ou par ressource

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const db = require("../config/db");


// Routes pour les cours
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);
router.get('/stats', courseController.getCourseStats);

module.exports = router;