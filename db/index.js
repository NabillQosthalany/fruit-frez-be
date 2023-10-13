const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost:27017/admin_dashboard'

mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db
