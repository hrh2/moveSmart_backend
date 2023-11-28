const mongoose = require('mongoose');

const busBookSchema = new mongoose.Schema({
    stationName:{type:String, required:true},
    plate:{type:String,required:true},
    ownerId: {type: String,required: true},
    ownerName:{type: String,required: true},
    from: {type: String,required: true},
    to:{type: String,required: true},
    sits: {type: String,required: true},
    code:{type: String,required: true},
    cost:{type: String,required: true},
    isUsed:{type: Boolean,default: false},
    isGiven:{type: Boolean,default: false},
    isSuspended:{type: Boolean,default: false},
    time:{type: String, default:Date.now()},
    date:{type: String,required: true}
});

const BusBooks = mongoose.model('BusBooks', busBookSchema);

module.exports =BusBooks;