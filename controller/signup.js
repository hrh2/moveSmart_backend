const router = require('express').Router();
const { User, VpFancyAdmin, StationCashier, validate, validateVpFancyAdmin, validateCashier } = require('../Models/user');
const { verifyToken, extractStationIDFromToken } = require('./tokenverify')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


router.post('/', async (req, res) => {
     try {
          const { error } = validate(req.body);
          if (error) {
               return res.status(400).json({ error: error.details[0].message, m: "me too idk" });
          }
          const Euser = await User.findOne({ email: req.body.email });
          if (Euser) {
               return res.status(400).json({ error: 'User already exists' });
          }
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(req.body.password, salt);
          const user = new User({
               firstName: req.body.firstName,
               lastName: req.body.lastName,
               email: req.body.email,
               phone: req.body.phone,
               cardNumber: req.body.cardNumber,
               username: req.body.username,
               password: hash,
               image: req.body.image,
               isVerified: false,
          });
          await user.save();
          const token = jwt.sign({ _id: user._id, email: user.email, phone: user.phone }, process.env.JWT);
          res.status(200).send({ token: token });
     } catch (error) {
          res.status(500).json({ message: 'Internal Server error' });
     }
});

router.post('/vpfancyadmin', async (req, res) => {
     try {
          const { error } = validateVpFancyAdmin(req.body);
          if (error) {
               return res.status(400).json({ message: error.details[0].message });
          }
          const Eadmin = await VpFancyAdmin.findOne({ adminID: req.body.adminID });
          if (Eadmin) {
               return res.status(400).json({ message: 'Admin with that ID already exists' });
          }
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(req.body.password, salt);
          const admin = new VpFancyAdmin({
               adminID: req.body.adminID,
               adminName: req.body.adminName,
               phone: req.body.phone,
               email: req.body.email,
               password: hash
          });
          await admin.save();
          const token = jwt.sign({ _id: admin._id, email: admin.email, phone: admin.phone }, process.env.JWT);

          return res.status(200).send({ token: token });
     } catch (error) {
          res.status(500).json({ message: 'Internal Server error ' + error.message });
     }
});

router.post('/admin', async (req, res) => {
     try {
          const { error } = validateVpFancyAdmin(req.body);
          if (error) {
               return res.status(400).json({ message: error.details[0].message });
          }
          const Eadmin = await VpFancyAdmin.findOne({ adminID: req.body.adminID });
          if (Eadmin) {
               return res.status(400).json({ message: 'Admin with that ID already exists' });
          }
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(req.body.password, salt);
          const admin = new VpFancyAdmin({
               adminID: req.body.adminID,
               phone: req.body.phone,
               email: req.body.email,
               password: hash
          });
          await admin.save();
          const token = jwt.sign({ _id: admin._id, email: admin.email, phone: admin.phone }, process.env.JWT);

          return res.status(200).send({ token: token });
     } catch (error) {
          res.status(500).json({ message: 'Internal Server error' });
     }
});

router.post('/cashier', verifyToken, async (req, res) => {
     try {
          const { error } = validateCashier(req.body);
          if (error) {
               return res.status(400).json({ message: error.details[0].message });
          }
          const stationID = extractStationIDFromToken(req);
          const cashier = await StationCashier.findOne({ cashierID: req.body.cashierID });
          if (cashier) {
               return res.status(400).json({ message: 'Cashier with that ID already exists' });
          }
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(req.body.password, salt);

          const newCashier = new StationCashier({
               cashierID: req.body.cashierID,
               cashierName: req.body.cashierName,
               phone: req.body.phone,
               email: req.body.email,
               stationID,
               ground: req.body.ground,
               password: hash
          });

          await newCashier.save();
          const token = jwt.sign({ _id: newCashier._id, email: newCashier.email, phone: newCashier.phone }, process.env.JWT);
          return res.status(200).send({ message: "Added a new cashier to the station", token });
     } catch (error) {
          return res.status(500).json({ message: error.message });
     }
});

module.exports = router;
