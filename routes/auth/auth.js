const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');


// Get signup page
router.get('/register', (req, res) => {
    res.render('auth/signup');
})


// Register the new user with duplicate error handling
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Create a new user instance
        const newUser = new User({ username, email });
        // Attempt to register the user
        await User.register(newUser, password);
        // Redirect to login page if successful
        res.redirect('/login');
    } catch (err) {
        if (err.code === 11000) { // MongoDB duplicate key error
            console.error("Duplicate email error: ", err);
            return res.status(409).send("User with this email already exists.");
        }
        // Handle any other errors that may occur
        res.status(500).send("An error occurred during registration.");
    }
});

// get login page

router.get('/login', (req, res) => {
    
    res.render('auth/login');
})


// Login the existing user
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {

    
    res.redirect('/products');
})


// Logout the user from the current session
router.get('/logout', (req, res) => {
    req.logout();

    res.redirect('/login');
})

module.exports = router;



