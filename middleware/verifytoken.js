const jwt = require("jsonwebtoken");
const User = require('../model/user')

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authorizationHeader.split(' ')[1];

    jwt.verify(token, 'secret_key',async  (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const foundUser = await User.findById(user.id)
            if (!foundUser){
                return res.status(404).json({message:'User not found'})
            }
            req.user={
                _id:foundUser._id,
                username:foundUser.username,
                role:foundUser.role
            }
            next();
        }catch (err){
            return res.status(500).json({message:'error retrieving user'})
        }
    });
};
module.exports = verifyToken


