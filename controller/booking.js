const express = require('express');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const { User } = require('../Models/user')
const  {Buses} = require('../Models/Buses')
const Ticket = require('../Models/Tickets')

router.post('/',verifyToken,async (req, res) => {
     try {
          const { plate,from,to,time,cost,passengers} = req.body;
          const ownerid = extractUserIdFromToken(req);
          const owner=await  User.findById(ownerid);
          const bus= await Buses.findOne({plate:plate});
          if(!bus){
               return res.status(404).json({message:"Couldn't find a bus"})
          }
          if(bus.availableSize<passengers){
               return res.status(404).json({message:`Please try to book according to the available space\n\tThe available space is ${bus.availableSize} ${bus.plate}`});
          }
          const ticket = new  Ticket({
               plate,
               time:bus.time,
               from,
               to,
               date:time,
               code:1234,
               cost:(passengers*cost),
               ownerId:ownerid,
               ownerName:owner.firstName+" "+owner.lastName,
               stationName:from,
               sits:passengers,
          }) 
          bus.availableSize=(bus.availableSize-passengers);
          bus.allPassengers.push(ticket.ownerName);
          if(bus.availableSize<1){
               bus.isFull=true;
          }
          await bus.save();
          await ticket.save();

          return res.status(200).json({ message: `Thanks for booking using our System\n Booked ${passengers} Sits for that you will have to pay ${ticket.cost}` });
     } catch (error) {
          return res.status(500).json({ message: 'Server error ' + error.message });
     }
});

module.exports = router;
