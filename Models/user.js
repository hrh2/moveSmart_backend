const mongoose=require('mongoose');
const joi=require('joi');
const passwordComplexity=require('joi-password-complexity');
require('dotenv').config();


const userSchema = new mongoose.Schema({
     firstName: { type: String, required: true },
     lastName: { type: String, required: true },
     email: { type: String, required: true },
     phone: { type: Number, required: true },
     username: { type: String, required: true },
     cardNumber: { type:String, required: true },
     password: { type: String, required: true },
     image:{type:String,required:false},
     isVerified: { type:Boolean,default:false},
});

const vpFancyAdminSchema = new mongoose.Schema({
     adminID: { type:Number, required:true},
     adminName:{type:String, required:true},
     phone: { type: Number, required:true},
     email: { type: String, required:true },
     password: { type: String, required:true },
});

const stationAdminSchema = new mongoose.Schema({
     adminID: { type:Number, required: true },
     adminName:{type:String, required:true},
     phone: { type: Number, required: true },
     email: { type: String, required: true },
     stationID:{ type:String,required: true },
     password: { type: String, required: true },
});

const stationCashierSchema = new mongoose.Schema({
     cashierID: { type:Number, required:true },
     cashierName:{type:String, required:true},
     email: { type: String, required: true },
     phone: { type: Number, required:true },
     stationID:{ type:String,required: true },
     ground:{type:String, required:true},
     password: { type: String, required:true },
});




const User=mongoose.model('User',userSchema);
const VpFancyAdmin=mongoose.model('VpFancyAdmin',vpFancyAdminSchema);
const StationAdmin=mongoose.model('StationAdmin',stationAdminSchema);
const StationCashier=mongoose.model('StationCashier',stationCashierSchema);

const validate = (data) => {
     const schema = joi.object({
          firstName: joi.string().required().label('First Name'),
          lastName: joi.string().required().label('Last Name'),
          email: joi.string().email().required().label('Email'),
          phone: joi.number().required().label('Phone Number'),
          cardNumber: joi.string().required().label('cardNumber'),
          username: joi.string().required().label('Username'),
          password: passwordComplexity().required().label('Password'),
          image: joi.allow(null).label('Image'),

     });
     return schema.validate(data);
};

const validateVpFancyAdmin = (data)=>{
     const schema = joi.object({
          adminID: joi.number().required().label('Your ID'),
          adminName: joi.string().required().label('Your Name'),
          phone: joi.number().required().label('Admin Phone'),
          email: joi.string().required().label('Admin Email'),
          password: passwordComplexity().required().label('Password'),
     });
     return schema.validate(data);
}
const validateCashier = (data)=>{
     const schema = joi.object({
          cashierID:joi.number().required().label('The ID'),
          cashierName:joi.string().required().label('The Name'),
          phone: joi.number().required().label('Phone'),
          email:joi.string().required().label('Email'),
          password:joi.string().required().label('The  password'),
          repassword:joi.string().required().label('The retyped password'),
          ground: joi.string().required().label('The Working Ground'),
      });
     return schema.validate(data);
}

const validatePasswordComplexity = (data)=>{
     const schema = joi.object({
          password: passwordComplexity().required().label('Password'),
     });
     return schema.validate(data);
}
module.exports={User,
     VpFancyAdmin,
     StationAdmin,
     StationCashier,
     validate,validateVpFancyAdmin,
     validatePasswordComplexity,
     validateCashier}
