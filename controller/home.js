const express = require('express');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const { User } = require('../Models/user')
const Station = require('../Models/stations')
const Ticket=require('../Models/Tickets')


router.get('/',verifyToken, async (req, res) => {
    try {
        const userID=extractUserIdFromToken(req)
        const stations = await Station.find();
        const user= await User.findById(userID);
        const tickets=await Ticket.find({ownerId:userID});
        res.json({userImage:user.image,name:user.lastName,tickets,stations});
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server error : ${err.message}`);
    }
});

module.exports = router;

