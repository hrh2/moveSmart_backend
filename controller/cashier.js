const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const { StationCashier, StationAdmin } = require('../Models/user')
const { extractStationIDFromToken } = require('./tokenverify')

router.get('/', verifyToken, async (req, res) => {
     try {
          const stationId = extractStationIDFromToken(req)

          const cashiers = await StationCashier.find({ stationID: stationId });

          if (!cashiers) {
               return res.status(404).json({ message: 'Station not found' });
          }

          return res.status(200).json(cashiers);

     } catch (err) {
          return res.status(500).send({ message: err.message });
     }
});

router.get('/:id', verifyToken, async (req, res) => {
     try {
          const cashier = await StationCashier.findById(req.params.id)
          if (!cashier) return res.status(404).send({ message: "Cashier not found with id: " + req.params.id });
          return res.status(200).json({
               cashierID: cashier.cashierID,
               cashierName: cashier.cashierName,
               phone: cashier.phone,
               email: cashier.email,
               ground: cashier.ground,
               adminadminPassword: null,
          });
     } catch (err) {
          return res.status(500).send('Server error :' + err.message);
     }
});
router.delete('/:id', verifyToken, async (req, res) => {
     try {
          const cashier = await StationCashier.findByIdAndDelete(req.params.id);
          if (!cashier) return res.status(404).json({ message: "cashier not found" });
          return res.status(200).json({ message: "Cashier successfully deleted" })
     } catch (error) {
          return res.status(500).json({ message: error.message });
     }
})
router.put('/:id', verifyToken, async (req, res) => {
     const { cashierID, cashierName, phone, email, ground } = req.body;
     const cashierIdToUpdate = req.params.id;
     try {
          const updatedCashier = await StationCashier.findByIdAndUpdate(
               cashierIdToUpdate,
               {
                    cashierID,
                    cashierName,
                    phone,
                    email,
                    ground,
               },
               { new: true } // This option returns the updated document
          );

          if (!updatedCashier) {
               return res.status(404).json({ message: 'Cashier not found' });
          }

          return res.status(200).json({ message: 'Cashier successfully updated' });
     } catch (error) {
          return res.status(500).json({ message: error.message });
     }
});



module.exports = router