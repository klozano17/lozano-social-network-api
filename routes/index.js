// Import the Express module and create a new router object
const router = require('express').Router();

// Import the API routes and associate them with the /api endpoint
const apiRoutes = require('./api');
router.use('/api', apiRoutes);

// Define a fallback route for any routes that don't match the ones above
router.use((req, res) => {
    res.status(404).send('Error!');
});

// Export the router object so it can be used in other parts of the application
module.exports = router;