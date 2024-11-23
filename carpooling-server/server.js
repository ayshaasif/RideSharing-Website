require('dotenv').config()
const express = require('express');
const app = express()
const path = require('path');
const cookieParser = require('cookie-parser');
const cors =  require('cors')
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500 ;

connectDB()

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/api/register'));
app.use('/login', require('./routes/auth/login'));
app.use('/trip', require('./routes/api/trip'));




app.all('*', (req,res)=>{
    res.status(404)
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname , 'views', '404.html'))
    }else if (req.accepts('json')){
        res.json({"message":"404 NOT FOUND"})
    }else{
        res.type('txt').send("404 Not Found")
    }
})

mongoose.connection.once('open', ()=>{
    console.log("connected to Mongoose DB")
    app.listen(PORT , ()=>{
        console.log(`Server running on ${PORT}`);
    })
})

mongoose.connection.on('error', (err)=>{
    console.log(err);
})