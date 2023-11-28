const mongoose = require('mongoose');

const stationsSchema = new mongoose.Schema({
     id:{type:String, required:true},
     adminID:{type:Number, required:true},
     adminName:{type:String, required:true},
     name: {type: String,required: true},
     commonName: {type: String,required: true},
     location: {type: String,required: true},
     stationDescription: {type:String,required: true},
     images: [{ type: String }],
     numberOfDestinations: { type:Number, default:0 },
     LinkedDestinationIDs: [{ type: String, required: false }],
});

const Station = mongoose.model('Station', stationsSchema);

module.exports = Station;
