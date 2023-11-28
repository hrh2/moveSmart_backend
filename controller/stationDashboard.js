const express = require('express');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const Station = require('../Models/stations')
const {Buses} = require('../Models/Buses')
const {User} = require('../Models/user')


router.get('/', async (req, res) => {
    try {
        const station= await Station.find();
        const user = await User.find()
        const buses=await Buses.find()

        const notLinked =station.filter(station => station.numberOfDestinations == 0)
        const linked =station.filter(stations => stations.numberOfDestinations != 0)
        const restBuses =buses.filter(buses => buses.isInRest == true)

        const totalStations=station.length
        const totalClients=user.length
        const linkedStations=linked.length
        const totalBuses= buses.length

        res.status(200).json({linkedStations,totalStations,totalClients,totalBuses,linked,station});
    } catch (err) {
        
        res.status(500).send('Server error on station dashboard: ' + err.message);
    }
});

module.exports = router