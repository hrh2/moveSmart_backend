const router = require('express').Router()
const Car = require('../Models/CarRental')
const { User } = require('../Models/user')
const { extractUserIdFromToken, verifyToken } = require('./tokenverify')

router.post('/', verifyToken, async (req, res) => {
  const {
    name,
    brand,
    plate,
    company,
    tyres,
    seats,
    price,
    color,
    use,
    model,
    speed,
    fuelkm,
    location,
    descriptions,
    discountValue,
    discountDesc,
    isAutomatic,
    isDriverProvided,
    street,
    images } = req.body

  try {
    const useID = extractUserIdFromToken(req);
    const car = new Car({
      carOwner: useID,
      name,
      plate,
      brand,
      company,
      location,
      descriptions,
      images,
      locationStreet: street,
      privileges: {
        discounts: [{
          percentage: discountValue,
          Details: discountDesc,
        }],
        driverProvidance: isDriverProvided,
      },
      specifications: {
        tyres,
        speed,
        seats,
        price,
        color,
        function: use,
        isAutomatic,
        model,
        fuelkm,
      },
    })
    await car.save()
    return res.status(201).json({ carId: car._id, message: `car added` })
  }
  catch (err) {
    console.log(err.message)
    return res.status(500).json({ message: `Internal error server, please try again later : ${err.message}` })
  }
})

router.put('/single/:id', verifyToken, async (req, res) => {
  const {
    name,
    brand,
    plate,
    company,
    tyres,
    seats,
    price,
    color,
    use,
    model,
    speed,
    fuelkm,
    location,
    descriptions,
    discountValue,
    discountDesc,
    isAutomatic,
    isDriverProvided,
    street,
    images
  } = req.body;

  try {
    let updateFields = {}; // Declare as 'let' to allow reassignment

    if (name && brand && plate && company && tyres && seats && price && color && use && model && speed && discountValue && discountDesc && isAutomatic && isDriverProvided && street && images) {
      updateFields = {
        name,
        plate,
        brand,
        company,
        location,
        descriptions,
        images,
        locationStreet: street,
        privileges: {
          discounts: [{
            percentage: discountValue,
            Details: discountDesc,
          }],
          driverProvidance: isDriverProvided,
        },
        specifications: {
          tyres,
          speed,
          seats,
          price,
          color,
          function: use,
          isAutomatic,
          model,
          fuelkm,
        },
      };

      const updateCar = await Car.findByIdAndUpdate(req.params.id, updateFields, { new: true });

      if (!updateCar) return res.status(404).json({ message: "Car not found" });

      return res.json({ message: "Car updated successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error, please try again later: " + err.message });
  }
});



router.delete('/single/:id', verifyToken, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id)
    if (!car) return res.status(404).json({ message: `Car not found` })

    return res.json({ car, message: `car updated` })
  } catch (err) {
    console.log(err);
    return res.status(200).json({ message: `Internal error server, please try again later`, error: err.message })
  }
})




router.get('/', verifyToken, async (req, res) => {
  try {
    const car = await Car.find();
    return res.status(200).json(car)
  }
  catch (error) {
    return res.status(500).json({ message: `Internal error : ${error.message}` })
  }
})

router.get('/single/:id', verifyToken, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: `car not found` })
    }
    return res.status(200).json(car)
  }
  catch (error) {
    return res.status(500).json({ message: `Internal error : ${error.message}` })
  }
})

router.get('/mine', verifyToken, async (req, res) => {
  try {
    const userID = extractUserIdFromToken(req);
    const userNumber = await User.countDocuments()
    const cars = await Car.find({ carOwner: userID });
    const totalCars = cars.length;

    let totalCarsViews = 0;
    let totalRate = 0;
    let totalClients = 0;

    for (let i = 0; i < totalCars; i++) {
      totalClients += cars[i].carRequests.length;
      totalCarsViews += cars[i].carViews.length;
      totalRate += cars[i].rate;
    }
    const avgViews = totalCars === 0 ? 0 : totalCarsViews / totalCars;
    const rate = (totalRate / totalCars)
    return res.status(200).json({ cars, totalCars, avgViews, totalClients, rate });
  } catch (error) {
    return res.status(500).json({ message: `Internal error: ${error.message}` });
  }
});

router.get('/recommends', verifyToken, async (req, res) => {
  try {
    // Fetch the top 5 cars with the highest ratings
    const topCars = await Car.find()
      .sort({ rating: -1 }) // Sort in descending order of rating
      .limit(4); // Limit the result to the top 5 cars

    return res.status(200).json(topCars);
  } catch (error) {
    return res.status(500).json({ message: `Internal error: ${error.message}` });
  }
});



router.get('/addviews/:id', verifyToken, async (req, res) => {
  try {
    const viewerID = extractUserIdFromToken(req);
    const userNumber = await User.countDocuments()
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    const totalClients = car.carRequests.length
    const rate = totalClients === 0 ? 20 : (totalClients / userNumber) * 100

    if (!car.carViews.includes(viewerID)) {
      car.carViews.push(viewerID);
      car.rate = rate;
      await car.save()
      return res.status(200).json({ message: 'Views updated' });
    }
    return res.status(200).json({ message: 'Already viewed' });
  } catch (error) {
    return res.status(500).json({ message: `Internal error: ${error.message}` });
  }
});

router.get('/views/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ message: `Internal error: ${error.message}` });
  }
});

router.get('/update/:id', verifyToken, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    return res.status(200).json(
      {
        name: car.name,
        brand: car.brand,
        plate: car.plate,
        company: car.company,
        tyres: car.specifications.tyres,
        seats: car.specifications.seats,
        price: car.specifications.price,
        color: car.specifications.color,
        use: car.specifications.function,
        model: car.specifications.model,
        speed: car.specifications.speed,
        fuelkm: car.specifications.fuelkm,
        location: car.location,
        descriptions: car.descriptions,
        discountValue: car.privileges.discounts[0].percentage,
        discountDesc: car.privileges.discounts[0].Details,
        isAutomatic: car.specifications.isAutomatic,
        isDriverProvided: car.privileges.driverProvidance,
        street: car.locationStreet,
        images: car.images,
      }
    )
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})


module.exports = router