// middleware/validateObjectId.js
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
    console.log(`Running ObjectId validation middleware on route: ${req.originalUrl} with ID: ${req.params.id}`);
    // Check if the id in the request parameters is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.log(`Invalid ObjectId detected: ${req.params.id}`);
	// If not, respond with a 400 error and an appropriate message
        return res.status(400).send("Invalid ID format");
    }
    console.log('Valid ObjectID: ${req.params.id}');
    // If valid, proceed to the next middleware or route handler
    next();
};
