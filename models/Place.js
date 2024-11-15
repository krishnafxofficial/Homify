const mongoose = require('mongoose');
const placeSchema = new mongoose.Schema({
    owner : {type : mongoose.Schema.Types.ObjectId, ref : 'User',
            require : true},
    title : {type : String , required : true},
    address : {type : String , required : true},
    photos : {type : [String] , required : false},
    description : {type : String , required : false},
    perks : {type : String , required : false},
    extraInfo : {type : String , required : false},
    checkIn : {type : Number , required : true},
    checkOut : {type : Number , required : true},
    maxGuest : {type : Number , required : true},
    price    : {type : Number , required : true}
    })

    const placeModel = mongoose.model("Place" ,placeSchema);
    module.exports = placeModel;