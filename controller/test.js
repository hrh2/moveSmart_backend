const express = require('express');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const Station = require('../Models/stations')


router.get('/', async (req, res) => {
    try {
        const stations = await Station.find();
        res.json(stations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { name, location, destination } = req.body;
    try {
        const station = await Station.findOne({ name })
        if (station) {
            const destinations = station.destination.find(dest => dest.name == destination.name);
            if (destinations) {
                for (let i = 0; i < destination.cars.length; i++) {
                    let car = destinations.cars.find(car => car.name == destination.cars[i].name);
                    if (car) {
                        continue;
                    } else {
                        destinations.cars.push(destination.cars[i])
                    }
                }
                await station.save()
                res.status(200).send({ message: `Some cars  have been added successfully in ${destination} the current state is ${station}` })
            } else {
                station.destination.push(destination);
                await station.save()
                res.status(200).send({ message: `the destinations in ${station.name} is updated` })
            }
        } else {
            const newStation = new Station({ name, location, destination: [destination] });
            await newStation.save();
            res.json(newStation);
        }
    } catch (err) {
        res.status(500).send('Server error' + err.message);
    }
});


router.put('/:id', async (req, res) => {
    const { name, location, destination } = req.body;

    try {
        const updatedStation = await Station.findOneAndUpdate(
            { _id: req.params.id },
            { name, location, destination },
            { new: true }
        );

        if (!updatedStation) {
            return res.status(404).json({ msg: 'Station not found' });
        }

        res.json(updatedStation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedStation = await Station.findByIdAndDelete(req.params.id);

        if (!deletedStation) {
            return res.status(404).json({ msg: 'Station not found' });
        }

        res.json({ msg: 'Station deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);

        if (!station) {
            return res.status(404).json({ msg: 'Station not found' });
        }

        res.json(station);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;

