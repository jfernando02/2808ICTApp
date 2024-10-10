const express = require('express');
const router = express.Router();
const Product = require('../../models/product');
const isLoggedIn = require('../../middleware/isLoggedIn');
const validateObjectId = require('../../middleware/validateObjectID');  // Import the existing middleware

// Get all the products and display on index
router.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products: products });
});

// Get form for new product
router.get('/products/new', isLoggedIn, (req, res) => {
    res.render('products/new');
});

// Creating a new Product
router.post('/products', isLoggedIn, async (req, res) => {
    await Product.create(req.body.product);
    res.redirect('/products');
});

// Showing a particular product with ObjectId validation
router.get('/products/:id', validateObjectId, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('reviews');
    if (!product) {
        return res.status(404).send("Product not found");
    }
    res.render('products/show', { product: product });
});

// Edit product with ObjectId validation
router.get('/products/:id/edit', isLoggedIn, validateObjectId, async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    res.render('products/edit', { product: product });
});

// Update product with ObjectId validation
router.patch('/products/:id', isLoggedIn, validateObjectId, async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body.product);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    res.redirect(`/products/${req.params.id}`);
});

// Delete Product with ObjectId validation
router.delete('/products/:id', isLoggedIn, validateObjectId, async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    res.redirect('/products');
});

module.exports = router;
