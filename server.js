const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config(); // parsing .env file


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());    // CORS is enabled for API routes
app.use(require('./routes'));   // routes
// app.use('/file/', express.static(path.resolve(__dirname, './uploads')))

// database init
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dq2un.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(`MongoDB is connected`))
.catch(err => console.log(err))


// http server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server is running at ${PORT}`));