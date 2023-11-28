const express = require('express');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const Station = require('../Models/stations');
const {Buses} = require('../Models/Buses')

async function fetchLinkedStationNames(linkedIDs, stations) {
  const stationNames = [];

  for (const linkedID of linkedIDs) {
    const buses =await stations.find((item) => item._id == linkedID);

    if (buses) {
      stationNames.push(buses.name);
    }
  }

  return stationNames;
}


router.get('/'/*,verifyToken*/, async (req, res) => {
  try {

    class ClientRoutes {
      constructor(from, to) {
        this.from = from;
        this.to = to;
      }
    }

    const stations = await Station.find();

    if (!stations || stations.length === 0) {
      return res.status(404).json({ message: 'No stations found' });
    }

    const routesArray = [];

    for (const buses of stations) {
      const linkedStationNames = await fetchLinkedStationNames(
        buses.LinkedDestinationIDs,
        stations
      );

      for (const linkedStationName of linkedStationNames) {
        const route = new ClientRoutes(buses.name, linkedStationName);
        routesArray.push(route);
      }
    }

    return res.status(200).json( routesArray );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


router.post('/available'/*,verifyToken*/, async (req, res) => {
  const {from,
         to,
         date} =  req.body;
  try {
      const stationFrom= await Station.findOne({name:from});
      const stationTo= await Station.findOne({name:to});
      const busesCategory1 = await Buses.find({ownerStation:stationFrom._id,destinationId:stationTo._id,inUseA:true,isFull:false});
      const busesCategory2 = await Buses.find({ownerStation:stationTo._id,destinationId:stationFrom._id,inUseA:false,isFull:false});
      const buses = busesCategory1.concat(busesCategory2)
      if (!buses) {
          return res.status(404).json({ message: 'Station not found' });
      }
     return res.status(201).json(buses);
  } catch (err) {
      return res.status(500).json({message:err.message});
  }
});

module.exports = router;

