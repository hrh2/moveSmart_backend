require('dotenv').config();
const router = require('express').Router();
const { User,VpFancyAdmin,StationAdmin, StationCashier } = require('../Models/user');
const Station = require('../Models/stations')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { log } = require('node-wit');

router.post('/', async (req, res) => {
   try {
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(401).send({ message: 'Invalid Email or Password' });

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(401).send({ message: 'Invalid Email or Password' });

      const token = jwt.sign({ _id: user._id,email:user.email ,phone:user.phone},process.env.JWT);
      res.status(200).send({ token:token});
   } catch (err) {
      res.status(500).send({ message: err.message });
   }
});

router.post('/admin', async (req, res) => {
   try {
      const { error } = validateStationAdmin(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });

      const admin = await StationAdmin.findOne({ adminID: req.body.adminID });
      if (!admin) return res.status(401).send({ message: 'Invalid ID or Password'});

      const validPassword = await bcrypt.compare(req.body.password, admin.password);
      if (!validPassword) return res.status(401).send({ message: 'Invalid ID or Password 2' });

      const station =  await Station.findOne({id:req.body.stationNumber})
      if (!station) return res.status(401).send({ message:` Station With Number ${req.body.stationNumber}  don't exist` });

      if(station._id != admin.stationID)return res.status(401).send({ message:`You Entered the wrong Station Number`});

      const token = jwt.sign({ _id: admin._id,phone:admin.phone,station:admin.stationID},process.env.JWT);
      
      return res.status(200).send(token);
   } catch (err) {
      res.status(500).send({ message: err.message });
   }
});

router.post('/cashier', async (req, res) => {
   const {  stationNumber,
            cashierID,
            password,
         } = req.body
   try {
      const { error } = validateStationCashier(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });
       
      const cashier = await StationCashier.findOne({ cashierID: cashierID });
      if (!cashier) return res.status(401).send({ message: 'Invalid ID or Password'});

      const validPassword = await bcrypt.compare(password,cashier.password);
      if (!validPassword) return res.status(401).send({ message: 'Invalid ID or Password2' });

      const station =  await Station.findById(stationNumber);
      if (!station) return res.status(401).send({ message:` Station With Number : ${req.body.stationNumber}  don't exist` });
      
      if(station._id != cashier.stationID)return res.status(401).send({ message:`You Entered the wrong Station Number`});
      
      const token = jwt.sign({ _id: cashier._id,phone:cashier.phone,station:cashier.stationID},process.env.JWT);
      
      return res.status(200).send({ token:token});
   } catch (err) {
      res.status(500).send({ message: err.message });
   }
});


router.post('/vpfancyadmin', async (req, res) => {
   try {
      const { error } = validateVpFancyAdmin(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });

      const vpFancyadmin = await VpFancyAdmin.findOne({ adminID: req.body.adminID });
      if (!vpFancyadmin) return res.status(401).send({ message: 'Invalid ID or Password'});

      const validPassword = await bcrypt.compare(req.body.password, vpFancyadmin.password);
      if (!validPassword) return res.status(401).send({ message: 'Invalid ID or Password' });

      const token = jwt.sign({ _id: vpFancyadmin._id,phone:vpFancyadmin.phone},process.env.JWT);

      return res.status(200).send({ token:token});
   } catch (err) {
      res.status(500).send({ message:"Internal Error : "+err.message });
   }
});


// data validation functions

const validateUser = (data) => {
   const schema = Joi.object({
      email: Joi.string().email().required().label('Email'),
      password: Joi.string().required().label('Password'),
   });
   return schema.validate(data);
};

const validateStationAdmin = (data) => {
   const schema = Joi.object({
        adminID: Joi.number().required().label('Your ID'),
        stationNumber: Joi.string().required().label('Station Number'),
        password: Joi.string().required().label('Password'),
   });
   return schema.validate(data);
};

const validateStationCashier = (data) => {
   const schema = Joi.object({
        cashierID: Joi.string().required().label('Your ID'),
        stationNumber: Joi.string().required().label('Station Number'),
        password: Joi.string().required().label('Password'),
   });
   return schema.validate(data);
};

const validateVpFancyAdmin = (data) => {
   const schema = Joi.object({
      adminID: Joi.string().required().label('Your ID'),
      password: Joi.string().required().label('Password'),
   });
   return schema.validate(data);
};

module.exports = router;
