const express = require('express');
const router = express.Router();
const { verifyToken} = require('./tokenverify');
const {Buses,validate,extractStationIDFromToken}= require('../Models/Buses')
const Station=require('../Models/stations');

router.post('/', verifyToken, async (req, res) => {
    try {
        const stationID = extractStationIDFromToken(req);
        const { error } = validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { plate, price, sits, time, direction } = req.body;

        const existingBus = await Buses.findOne({ plate });

        if (existingBus) {
            return res.status(409).json({ message: 'Bus already exists' });
        }

        const destinationNameInUpperCase = direction.toUpperCase();

        const station1 = await Station.findById(stationID);

        if (!station1) {
            return res.status(404).json({ message: `Station with id: ${stationID} not found or not registered, Try to log in again` });
        }

        const station2 = await Station.findOne({ name: destinationNameInUpperCase });

        if (!station2) {
            return res.status(404).json({ message: `Station: ${direction} not found, Not registered` });
        }

        if (station1.name === station2.name) {
            return res.status(400).json({ message: 'Trying to link the same station' });
        }

        if (!station1.LinkedDestinationIDs.includes(station2._id)) {
            station1.numberOfDestinations++;
            station1.LinkedDestinationIDs.push(station2._id);
            station2.numberOfDestinations++;
            station2.LinkedDestinationIDs.push(station1._id);
            await station1.save();
            await station2.save();
        }

        const newBus = new Buses({
            plate,
            price,
            sits,
            time,
            ownerStation: stationID,
            destinationId: station2._id,
            destinationName: destinationNameInUpperCase,
            availableSize:sits,
            inUseA:true,
        });

        await newBus.save();

        return res.status(201).json({
            message: 'Bus saved successfully',
            id: newBus._id,
            linkedStation: `${station1.name} and ${station2.name}`,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/',verifyToken, async (req, res) => {
    try {
        const stationID = extractStationIDFromToken(req);
        const bus = await Buses.find({ownerStation: stationID});
        if(!bus){
            return res.status(404).json({message: 'No bus found'})
        }
        return res.status(200).json(bus);
    } catch (err) {
      return  res.status(500).json({message:err.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { plate, price, sits, time,direction} = req.body;
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const updatedBus = await Buses.findOneAndUpdate(
            { _id: req.params.id },
            {
                plate,
                price,
                sits,
                time,
            },
            { new: true }
        );

        if (!updatedBus) {
            return res.status(404).json({ mesage: 'Buses not found' });
        }

        res.json(updatedBus);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedBus = await Buses.findByIdAndDelete(req.params.id);

        if (!deletedBus) {
            return res.status(404).json({ mesage: 'Buses not found' });
        }

        res.json({ mesage: 'Buses deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const bus = await Buses.findById(req.params.id);

        if (!bus) {
            return res.status(404).json({ mesage: 'Buses not found' });
        }

        res.json(bus);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;

