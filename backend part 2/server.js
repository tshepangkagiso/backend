'use strict'
require('dotenv').config()
const express = require('express'), app = express();
const path = require('path');
const {logger, logEvents} = require('./middleware/logger');
const eventHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser');// Importing the 'cookie-parser' middleware for parsing cookies in Express.js
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

//Database configuration
connectDB()

//Middleware
app.use(logger);
app.use( cors(corsOptions) );// Using the 'cors' middleware to handle Cross-Origin Resource Sharing (CORS) in Express.js
app.use(express.json());
app.use(cookieParser());// Using cookieParser middleware to parse incoming request cookies
app.use('/', express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/root'));
app.use('/users', require('./routes/userRoutes'))
app.use('/users', require('./routes/noteRoutes'))
app.all('*', (req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts(json)){
        res.json({message: '404 Not Found'})
    }else{
        res.type('txt').send('404')
    }
})

//Middleware to run just before app listens
app.use(eventHandler);

//Server
mongoose.connection.once('open', () => {
    console.log('connected to mongodb');
    app.listen(PORT, ()=>{console.log(`server running on port ${PORT}`)})     
});

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})

