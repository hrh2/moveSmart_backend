const express = require('express');
const router = express.Router();
const { verifyToken, extractStationIDFromToken } = require('./tokenverify');
const Station = require('../Models/stations')
const {Buses} = require('../Models/Buses')

class BusesStastics {
    constructor(busplate, remainingSeats) {
      this.busplate = busplate;
      this.remainingSeats = remainingSeats;
    }
  }

router.get('/',verifyToken, async (req, res) => {
    try {
        const stationID =extractStationIDFromToken(req);
        const busesCategory1 = await Buses.find({ownerStation:stationID,inUseA:true});
        const busesCategory2 = await Buses.find({destinationId:stationID,inUseA:false});
        const buses = busesCategory1.concat(busesCategory2)
        let resBuses = [];
        for (const bus of buses) {
            let busObject = new BusesStastics(bus.plate,bus.availableSize)
            resBuses.push(busObject);
        }
       return res.status(200).json({message:"all retrieved", buses:resBuses});
    } catch (err) {
       return res.status(500).json({message: err.message});
    }
});

module.exports = router