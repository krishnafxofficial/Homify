const express = require('express');
const router  = express.Router();
const Booking = require('../models/Booking');
const { JsonWebTokenError } = require('jsonwebtoken');
const { reject } = require('bcrypt/promises');
const jwt = require("jsonwebtoken")
const jwtSecret = 'abcdefghi1234'

// For booking
router.post('/bookings',async (req,res) =>{
    if(req.cookies.token == null){
        res.status(404).json({"message": "Token not available"});
        return; 
    }
    const userData = await getUserDataFromReq(req);
    const {
        place,checkIn,checkOut,numberOfGuests,name,phone,price
    } = req.body; 
    Booking.create({
        place,checkIn,checkOut,numberOfGuests,name,phone,price,
        user: userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) =>{
        throw err;
    });  
});

function getUserDataFromReq(req) {
   return new Promise((resolve,reject) => {
   jwt.verify(req.cookies.Token,jwtSecret,{}, (err,userData) =>{
        if(err) throw err;
       resolve(userData);
    });
   });
}


router.get('/bookings',async (req,res) => {
    console.log(`req.cookies token ${req.cookies.token} Token ${req.cookies.Token}`); 
    if(req.cookies.token == null){
        res.status(404).json({"message": "Token not available"});
        return; 
    }
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find ({user: userData.id}) )
 })

module.exports = router;