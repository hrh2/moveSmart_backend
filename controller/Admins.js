const express = require('express');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const {VpFancyAdmin,validateVpFancyAdmin,validatePasswordComplexity} = require('../Models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.put('/personal', async (req, res) => {
    const {
        adminName,
        adminID,
        phone,
        email,
        password,
    } = req.body;
    try {

      const admin_ID = extractUserIdFromToken(req);
      const admin = await VpFancyAdmin.findById(admin_ID);
  
      if (!admin) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Validate the admin's password
      if (!password)return res.status(401).json({message: 'Please enter your password'});

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Please provide a valid password ' });
      }
      const newAdminPassword = {
        adminName,
        adminID,
        phone,
        email
      }
      // Create an object with the fields you want to update
      const {error} =  validateVpFancyAdmin(req.body)
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
      // Use findByIdAndUpdate to update the admin document
      const updatedUser = await VpFancyAdmin.findByIdAndUpdate(admin_ID, newAdminPassword, { new: true });
  
      // Renew the admin's JWT token
      const token = jwt.sign(
        { _id: admin._id, email: admin.email, phone: admin.phone },
        process.env.JWT
      );
  
      return res.json({ message: 'Your account is up to date', token });
      
    } catch (err) {
      return res.status(500).json({ message: err.message});
    }
  });


  router.put('/password', async (req, res) => {
    const {
        current,
        password,
        rePassword,
    } = req.body;
    try {

      const admin_ID = extractUserIdFromToken(req);
      const admin = await VpFancyAdmin.findById(admin_ID);
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      // Validate the admin's password
      if (!password)return res.status(401).json({message: 'Please enter your password'});

      const validPassword = await bcrypt.compare(current, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Please provide a valid password ' });
      }
     
      // Create an object with the fields you want to update
      const {error} =  validatePasswordComplexity({password})
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
     const newAdminPassword = {
        password:hashedPassword
      }

      // Use findByIdAndUpdate to update the admin document
      const updatedUser = await VpFancyAdmin.findByIdAndUpdate(admin_ID, newAdminPassword, { new: true });
  
      // Renew the admin's JWT token
      const token = jwt.sign(
        { _id: admin._id, email: admin.email, phone: admin.phone },
        process.env.JWT
      );
  
      return res.json({ message: 'Your Password Changed Successfully', token });
      
    } catch (err) {
      return res.status(500).json({ message: err.message});
    }
  });


  router.get('/personal',verifyToken, async (req,res)=>{
    try{
      const admin_ID = extractUserIdFromToken(req);
      const admin = await VpFancyAdmin.findById(admin_ID);
      if(!admin) return res.status(404).json({ message: `Admin not found with ${admin_ID}` });
      return res.status(200).json(
        {
        adminName:admin.adminName,
        adminID:admin.adminID,
        phone:admin.phone,
        email:admin.email,
        password:null,
      }
      )
    }catch (error) {
      return res.status(500).json({ message:error.message });
    }
   })

  
  module.exports = router;