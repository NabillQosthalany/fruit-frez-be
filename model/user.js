const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin','user'],
        default: 'user'
    },
})

userSchema.index({username:1},{unique:true})

const User = mongoose.model('User', userSchema)
module.exports = User

