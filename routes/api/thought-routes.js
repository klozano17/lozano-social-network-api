const router = require('express').Router();

// Importing from thought-controller
const { 
    getThoughts, 
    getThoughtById, 
    createThought, 
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// Route:  /api/thoughts
router.route('/')
    .get(getThoughts);

// Route:  /api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought); 

// Route:  /api/thoughts/:userId
router.route('/:userId')    
    .post(createThought);

// Route:  /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions')
    .post(addReaction);

// Route: /api/thoughts/:thoughtId/reactionId
router.route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;