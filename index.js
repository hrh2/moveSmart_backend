const express=require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;
const connection=require('./Models/DB');


connection()

//routes

const userRoutes = require('./controller/signup');
const loginRoutes = require('./controller/login');
const userProfileRoutes = require('./controller/userProfile');
const homepageRoute=require('./controller/home');
const stationRoutes = require('./controller/stations');
const busRoutes=require('./controller/buses');
const stationDashboardRoute=require('./controller/stationDashboard')
const carRentalRoutes=require('./controller/carRental')
const VpAdminRoutes =  require('./controller/Admins')
const bookingRoute = require('./controller/BusBooks')
const booking = require('./controller/booking');
const ticketsRoute = require('./controller/tickets')
const manageTicketsRoute= require('./controller/BusBooksManagement')
const cashierRoute = require('./controller/cashier')
const cashierDashboard = require('./controller/cashierDashboard')



app.use(cors())
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({extended:true,limit: '30mb' }));

//apis

app.use('/api/user',userRoutes);
app.use('/api/login',loginRoutes);
app.use('/api/profile',userProfileRoutes);
app.use('/api/home',homepageRoute);
app.use('/api/station/dashboard',stationDashboardRoute);
app.use('/api/station',stationRoutes);
app.use('/api/bus',busRoutes);
app.use('/api/car',carRentalRoutes)
app.use('/api/vpfancyadmin',VpAdminRoutes)
app.use('/api/cashier',cashierRoute);
app.use('/api/book',bookingRoute);
app.use('/api/book',booking);
app.use('/api/tickets',ticketsRoute);
app.use('/api/tickets/manage',manageTicketsRoute);
app.use('/api/dash/cashier',cashierDashboard);



//starting  server


app.listen(port,()=>{
     console.log(`server started on http://localhost:${port}`);
})

