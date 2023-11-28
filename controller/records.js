const express = require('express');
const router = express.Router();
const { verifyToken, extractUserIdFromToken } = require('./tokenverify');
const { User } = require('../Models/user')

// GET request to get account and last task of logged in user
router.get('/', verifyToken, async (req, res) => {
     try {
          const userID = await extractUserIdFromToken(req);
          const user = await User.findOne({ _id: userID });
          if (!user) {
               return res.status(404).json({ msg: 'User not found' });
          }
          const {lastTask,account,email,_id} = user;
          res.json({account,lastTask });
     } catch (err) {
          console.error(err.message + "\n this is the errror");
          if (!res.headersSent) {
               res.status(500).send('Server Error');
          }
     }
});


module.exports = router;
