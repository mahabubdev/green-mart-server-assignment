const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); // parsing .env file


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', cors());    // CORS is enabled for API routes
app.use(require('./routes'));   // routes


// http server
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => console.log(`Server is running at ${PORT}`));