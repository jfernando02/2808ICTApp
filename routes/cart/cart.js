const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const isLoggedIn = require('../../middleware/isLoggedIn');
const validateObjectId = require('../../middleware/validateObjectID');  // Import the middleware
const User = require('../../models/user');

// Show user cart with populated items
router.get('/user/cart', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id).populate('cart');
    res.render('cart/showcart', { cart: user.cart });
});

// Add a product to the user cart with ObjectId validation
router.post('/user/:id/cart', isLoggedIn, validateObjectId, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).send("Product not found");
    }

    const user = req.user;
    user.cart.push(product);
    await user.save();

    res.redirect('/user/cart');
});

// Remove an item from the cart using ObjectId validation
router.delete('/cart/:id/item/:itemId', validateObjectId, async (req, res) => {
    const { id, itemId } = req.params;

    // Additional validation for `itemId` since we have two parameters
    if (!validateObjectId({ params: { id: itemId } })) {
        return res.status(400).send("Invalid Item ID format");
    }

    await User.findByIdAndUpdate(id, { $pull: { cart: itemId } });
    res.redirect('/user/cart');
});

module.exports = router;
