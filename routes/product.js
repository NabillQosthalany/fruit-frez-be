const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const Product = require('../model/product')

router.post('/create', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({message: 'You are not an admin !'});
    }

    try {
        const {name, description, price,stock} = req.body;
        const userId = req.user._id;
        const existingProduct = await Product.findOne({name, userId: req.user._id})
        if (existingProduct) {
            return res.status(400).json({message: 'The Product Name is already in use'})
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            userId: req.user._id,
        });

        await product.save();
        return res.status(201).json({message: 'Product Created', product});
    } catch (err) {
        return res.status(500).json({message: 'Error creating product'});
    }
});
router.get('/', verifyToken, async (req, res) => {
    try {
        const products = await Product.find({userId: req.user._id})
        return res.status(200).json({message: 'Products retrieved', products})
    } catch (err) {
        return res.status(500).json({message: 'Error retrieving products'})
    }
})
router.put('/:productId', verifyToken, async (req, res) => {
    try {
        const {name, description, price, stock} = req.body
        const productId = req.params.productId

        const product = await Product.findOne({_id: productId, userId: req.user._id})

        if (!product) {
            return res.status(404).json({message: 'Product not found'})
        }

        product.name = name
        product.description = description
        product.price = price
        product.stock = stock

        await product.save()
        return res.status(200).json({message: 'Product updated successfully', product})
    } catch (err) {
        return res.status(500).json({message: 'error updating product'})
    }
})
router.delete('/:productId', verifyToken, async (req, res) => {
    try {
        const productId = req.params.productId

        const product = await Product.findOne({_id: productId, userId: req.user._id})
        if (!product) {
            return res.status(404).json({message: 'Product not found'})
        }
        await product.remove()
        return res.status(200).json({message: 'Product deleted successfully'})
    } catch (err) {
        return res.status(500).json({message: 'error deleting product'})
    }
})
router.post('/:productId/buy-product', async (req, res) => {
    try {
        const productId = req.params.productId
        const quantity = req.body.quantity;

        if (quantity <= 0) {
            return res.status(404).json({message: "Jumlah Product Tidak Valid"})
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({message: 'Product not found'})
        }

        if (product.stock < quantity) {
            return res.status(400).json({message: "Stock is not enough"})
        }

        product.stock -= quantity
        await product.save()

        return res.status(200).json({message: 'Pembelian berhasil', product})
    } catch (err) {
        return res.status(500).json({message: 'Failed to buy product'})
    }
})
router.get('/total-stock', verifyToken,async (req, res) => {
    try {
        const totalStock = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    total: {$sum: '$stock'}
                }
            }
        ])
        if (totalStock.length === 0) {
            return res.status(404).json({message: 'No Stock Product'})
        }

        const total = totalStock[0].total
        return res.status(200).json({totalStock: total})
    } catch (err) {
        return res.status(500).json({message:'Error calculating total stock'})
    }
})
module.exports = router
