const mongoose = require('mongoose');

const carRentalSchema=new mongoose.Schema({
    carOwner:{type:String, required:true},
    name:{type:String, required:true},
    plate:{type:String, required:true},
    brand:{type:String, required:true},
    company:{type:String, required:true},
    location:{type:String, required:true},
    locationStreet:{type:String},
    descriptions:{type:String, required:true},
    privileges:{
        discounts:[{
            percentage:{type:String, required:false},
            Details: { type: String, required: false}
        }],
        driverProvidance:{type:Boolean, required:true},
    },
    specifications:{
    tyres:{type:Number, required:true},
    seats:{type:Number, required:true},
    price:{type:Number, required:true},
    speed:{type:Number,required:true},
    color:{type:String, required:true},
    function:{type:String, required:true},
    isAutomatic:{type:Boolean, required:true},
    model:{type:String, required:true},
    fuelkm:{type:Number, required:true},
    },
    images:{type:Array, required:true},
    carRequests:[{ type: String }],
    carViews: [{ type: String }],
    carLikes: [{ type: String }],
    rate:{type:Number, required:false,default:20},
})


const Car=mongoose.model('Cars',carRentalSchema)

module.exports = Car