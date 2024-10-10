const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const Review = require('../../models/review');
const isLoggedIn = require('../../middleware/isLoggedIn');
const validateObjectId = require('../../middleware/validateObjectID');  // Import the validateObjectID middleware

// Creating a new review for a product with ObjectId validation
router.post('/products/:id/review', isLoggedIn, validateObjectId, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).send("Product not found");
    }

    const { rating, body } = req.body.review;
    const { username } = req.user;

    let review = new Review({ rating: rating, body: body, username: username });
    product.reviews.push(review);

    await review.save();
    await product.save();

    res.redirect(`/products/${req.params.id}`);
});

module.exports = router;
