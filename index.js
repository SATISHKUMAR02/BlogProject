const express = require('express');
const helmet  = require('helmet');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const connectDB = require('./config/db');
const authrouter = require('../auth/routers/api/authRouter');

connectDB();

const app = express()
app.use(express.json())
app.use('/auth',authrouter)

app.use(cors()) // enabling CORS in the application
app.use(helmet())
app.use(cookieparser())
app.use(express.urlencoded({extended:true})) //=> helps in reading url encoded data , reading the raw data from the request body,parse to javascript object and attach to req.body
app.use(express.json())
app.get('/',(req,res)=>{
    res.json({'message':"server running"})
})
app.listen(process.env.PORT,()=>{
    console.log("server listening");
});