const mongoose  = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:String,
    price:Number,
    stock:Number,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

const Product = mongoose.model('Product',productSchema)

module.exports = Product
