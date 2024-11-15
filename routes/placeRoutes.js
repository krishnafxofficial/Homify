const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const fs = require('fs');
const multer = require('multer');
const imageDownloader = require('image-downloader');
const jwt = require("jsonwebtoken")

const bcrypt = require('bcrypt');
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'abcdefghi1234'

// Usind POST request to upload images by link.
router.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = Date.now() + '.jpg';

    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName
    })
    res.json(newName);
})


const photosMiddleware = multer({ dest: 'uploads/' })
router.post('/uploads', photosMiddleware.array('photos', 100), (req, res) => {
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''))
    }
    res.json(uploadedFiles);
})


router.post('/places', (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, photos: addedPhotos, description, price,
        perks, extraInfo, checkIn, checkOut, maxGuest
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id, price,
            title, address, addedPhotos, description,
            perks, extraInfo, checkIn, checkOut, maxGuest
        })
        res.json(placeDoc);
    })
})

router.get('/user-places', async (req, res) => {
    // mongoose.connect(process.env.MONGODB_URL_LOCAL);
    const userData = await getUserDataFromReq(req);
    // const { token } = req.cookies;
    // jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    //     console.log(`user-places ${userData}`)
    //     const { id } = userData;
    //     res.json(await Place.find({ owner: id }));
    // })

    console.log(`user-places ${userData}`)
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
})


function getUserDataFromReq(req) {
    console.log(`getUserDatafromReq:: token ${req.cookies.token}`)
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    });
}


router.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
})

// For updation in Places
router.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        id, title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuest, price
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuest
            });
            await placeDoc.save();
            res.json('ok')
        }
    })
})

router.get('/places', async (req, res) => {
    res.json(await Place.find());
})





module.exports = router;