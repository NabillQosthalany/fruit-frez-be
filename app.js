const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('../API-Dashboard/db/index')

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
