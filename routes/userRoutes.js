const express = require('express');
const router  = express.Router();
const User    = require('./../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'abcdefghi1234'

// POST route to add a user.
router.post('/register',async (req,res) => {

    console.log('register:: Request body:', req.body);

    const {name,email,password} = req.body;

    try{
        const userDoc =  await User.create({
            name,
            email,
            password : bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(userDoc);
    }catch(err){
        res.status(422).json({error : err.toString()}); 
    }

})

// Using POST route for login
router.post('/login',async (req,res) => {
    const {email,password} = req.body;
    // res.json("Not FOund Data")
    // return; 
    const userDoc = await User.findOne({email});
    // const userDoc = await User.find();
    if (!userDoc) {
        return res.status(404).json({ message: 'User not found' });
    }
    const passOk = await bcrypt.compare(password,userDoc.password)
        if(passOk){
            jwt.sign({
                email : userDoc.email,
                id : userDoc._id,
                name : userDoc.name},
                jwtSecret, {}, (err,token) => {
                if(err) throw err ;
                res.cookie("token", token, {
                    maxAge: 24*60*60*1000  
                }).json(userDoc)
           })
}
})

// Using GET method for User profile.
router.get('/profile' , (req,res) => {
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {} ,async (err,userData) => {
            if(err) throw err;
          const {name,email,_id} =  await User.findById(userData.id)
            res.json({name,email,_id});
      })
        }else{
            res.json(null);
        }
})

// Routes for logout

router.post('/logout', (req,res) =>{
    res.cookie('token', '').json(true);
})


module.exports = router;