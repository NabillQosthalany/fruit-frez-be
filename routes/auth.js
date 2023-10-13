const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const verifyToken = require('../middleware/verifyToken')


// Login User
router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid Password'});
        }

        const tokenPayload = {
            id: user.id,
            role: user.role,
            userId: user._id,
        };
        const token = jwt.sign(tokenPayload, 'secret_key', {expiresIn: '2h'});

        return res.status(200).json({message: 'Login Successful', token, role: user.role, userId: user._id});
    } catch (err) {
        return res.status(500).json({message: 'Error logging in'});
    }
});

// Register User
router.post('/register', async (req, res) => {
    try {
        const {username, password, role} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword,
            role,
        });

        await user.save();
        return res.status(201).json({message: 'User registered successfully', user});
    } catch (error) {
        return res.status(500).json({message: 'Error registering user'});
    }
});

router.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id,)
        if (!user) {
            return res.status(404).json({message: 'Tidak ada pengguna yang login'})
        }
        res.json({username: user.username, role: user.role})
    } catch (err) {
        console.log('err', err)
        res.status(500).json({message: 'terjadi kesalahan'})
    }
})

module.exports = router
