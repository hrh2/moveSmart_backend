const express = require('express');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const {extractStationIDFromToken} = require('../Models/Buses')
const Station = require('../Models/stations')
const {StationCashier} = require('../Models/user')
const Tickets = require('../Models/Tickets');
const { route } = require('./test');

router.get('/',verifyToken, async (req, res) => {
    try {
        const workingStationId= extractStationIDFromToken(req)
        const cashierId = extractUserIdFromToken(req)
        const cashier = await StationCashier.findById(cashierId)
        if(!workingStationId) return res.status(404).json({message:"Try Signing in again"})

        const station = await Station.findById(workingStationId);
        if(!station) return res.status(404).json({message:"Station not Found Inform the Station Manager"});

        const tickets = await Tickets.find({from:station.name,to:cashier.ground});
        if(!tickets)return res.status(404).json({message: "0 tickets found"})

        return res.status(200).json({tickets,name:station.name,ground:cashier.ground});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.get('/gave-ticket/:id',verifyToken, async (req, res) => {
    try {
        const deletedTicket =  await Tickets.findByIdAndUpdate(req.params.id,{isGiven:true})
        if(!deletedTicket) return res.status(404).json({message:`Ticket with id ${req.params.id} no Longer Exists`});
        return res.status(200).json({message:"Ticket is given successfully "});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

module.exports = router