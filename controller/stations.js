const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const Station=require('../Models/stations')
const {Buses,fetchBusesOfStation} = require('../Models/Buses')
 const {StationAdmin} = require('../Models/user')
const { extractStationIDFromToken} = require('../Models/Buses')


router.get('/admin',verifyToken, async (req, res) => {
     try {
          const stationId = extractStationIDFromToken(req)
          if(!stationId)return res.status(401).json({message:"you didn't Login"})
          
          const station = await Station.findById(stationId);
          if (!station) {
               return res.status(404).json({ message: 'Station not found' });
          }
          return res.status(200).json(station);
     } catch (err) {
          return res.status(500).send({message:err.message+" Sever error"});
     }
});

router.get('/destinations', async (req, res) => {
     try {
     class ClientStation {
          constructor(id,StationName, numberOfBuses) {
               this.id = id;
               this.StationName = StationName;
               this.numberOfBuses = numberOfBuses;
          }
     }          
     const stationID = extractStationIDFromToken(req)    
     const station = await Station.findById(stationID);
     if (!station) {
         return res.status(404).json({ message: 'Station not found' });
     }
     let ClientStationContainer=[];
     const linkedDestinationIDs = station.LinkedDestinationIDs;
     const linkedStations = await Station.find({ id: { $in: linkedDestinationIDs } });

     for(let i = 0; i < linkedStations.length; i++) {
          const size =await fetchBusesOfStation(stationID,linkedStations[i].name)
          const destination =new ClientStation( i,linkedStations[i].name,size);
          ClientStationContainer.push(destination);
     }

       return res.status(200).json(ClientStationContainer );
     } catch (err) {
       return res.status(500).json({ message: err.message });
     }
   });
   
router.get('/',verifyToken, async (req, res) => {
     try {
          const stations = await Station.find();
          return res.status(200).json(stations);
     } catch (err) {
          return res.status(500).send('Server error :'+err.message);
     }
});

router.get('/linked',async (req,res)=>{
     try{
          const stations=await Station.find()
          const linkedStations=stations.filter(station=>station.numberOfDestinations!=0)
          return res.status(200).json(linkedStations);
     }catch(err){
         return res.status(500).json({message:err.message});
     }
})

router.post('/',async (req, res) => {
     try {
          const {name,
                 commonName, 
                 location, 
                 stationDescription,
                 images,
                 adminID,
                 adminName,
                 adminPhoneNumber,
                 adminEmail,
                 adminPassword} = req.body;
                 
          const station = await Station.findOne({ name })
          if(station){return res.status(400).send({msg:'station already exists'})}
          const newStation=new Station({
               adminID,
               adminName,
               name:name.toUpperCase(),
               commonName,
               location,
               stationDescription,
               images:images,
           })

          const admin = await StationAdmin.findOne({adminID:adminID})
          if(!admin){
             const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(adminPassword, salt);

             const stationAdmin = new StationAdmin({
               adminID:adminID,
               adminName:adminName,
               email:adminEmail,
               phone:adminPhoneNumber,
               password:hashedPassword,
               stationID:newStation._id,
             })

            await stationAdmin.save();
            newStation.id=newStation._id
            await newStation.save();

            return res.status(200).json({message:`${adminName}  got a station to manage`})

          } else 
          return res.status(400).json({message:`${adminName} already has a station to manage`})

          // newStation.id=newStation._id
          // await newStation.save();
          

          // return res.status(201).json({message:"station saved ",id:newStation._id})
     } catch (err) {
          return res.status(500).json({ message: err.message });
     }
});


router.put('/:id', async (req, res) => {
     const { name, location, destination } = req.body;

     try {
          const updatedStation = await Station.findOneAndUpdate(
               { _id: req.params.id },
               {
                    name,
                    commonName,
                    location,
                    stationDescription,
                    images,
               },
               { new: true }
          );

          if (!updatedStation) {
               return res.status(404).json({ msg: 'Station not found' });
          }

          res.json(updatedStation);
     } catch (err) {
          return res.status(500).json({message:+err.message});
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
          return res.status(500).json({message:+err.message});
     }
});


module.exports = router;

