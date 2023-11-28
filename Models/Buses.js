const mongoose = require('mongoose');
const joi = require('joi')
const jwt = require('jsonwebtoken');

const busesSchema = new mongoose.Schema({
    ownerStation:{type: String, required: true},
    plate: { type: String, required: true },
    price: { type: Number, required: true },
    sits: { type: Number, required: true },
    time: { type: String, required: true },
    isInRest: { type: Boolean, default: false },
    inUseA:{type: Boolean, default: false},
    isFull: { type: Boolean, default: false},
    availableSize: {type: Number,required: false,min: 0,default:0},
    destinationId:{type: String, required: true},
    destinationName:{type: String, required: true},
    allPassengers:{type:Array},
});

const Buses = mongoose.model('Buses', busesSchema);

const validate = (data) => {
    const schema = joi.object({
        plate: joi.string().required().label('Plate'),
        price: joi.number().required().label('Price'),
        sits: joi.number().required().label('Sits'),
        time: joi.string().required().label('Time'),
        direction: joi.string().required().label('Destination Name'),
    });
    return schema.validate(data);
};

function extractStationIDFromToken(req) {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    const decodedToken = jwt.decode(token);
    const stationID = decodedToken ? decodedToken.station : null;
    return stationID;
}
async function fetchBusesOfStation(stationID, destination) {
    const buses = await Buses.find();
    const filteredBuses = buses.filter(
      (bus) => bus.ownerStation === stationID && bus.destinationName === destination
    );
    const size = filteredBuses.length;
    return size;
  }   
module.exports = { Buses, validate,extractStationIDFromToken,fetchBusesOfStation};