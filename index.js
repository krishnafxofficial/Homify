const express = require('express');

const cors = require("cors"); 
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const db = require('./db');
// Import the router files
const userRoutes  = require('./routes/userRoutes');
const placeRoutes = require('./routes/placeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'abcdefghi1234'

app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173',
  }));

// Use the routers
app.use('/',userRoutes);
app.use('/',placeRoutes);
app.use('/',bookingRoutes);

app.get('/test',(req,res) =>{
    res.json('test ok');
})

app.listen(process.env.PORT, () =>{ 
    console.log(`Server started on http://127.0.0.1:${process.env.PORT}`);
})