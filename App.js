const mongoose = require('mongoose');
require('dotenv').config();

// Middleware
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const socket = require('./socket');


const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');

const port = process.argv[2] || 3015;
const app = express();
const RideRequest = require('./models/Riderequest');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes);
app.use('/rides', rideRoutes);

const expressServer = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`Open your browser and navigate to http://localhost:${port}`); // Add this line
});

const io = socket.init(expressServer);

// Add WebSocket connection handling 
io.on('connection', (socket) => {
  socket.on('joinRideRoom', (rideId) => {
    socket.join(`ride_${rideId}`);
  });
  
  // Add this new event
  socket.on('joinDriverRoom', () => {
    socket.join('driversRoom');
  });

  socket.on('confirmPickup', async ({ rideId }) => {
    try {
      const ride = await RideRequest.findById(rideId)
        .populate('studentId', 'firstName phoneNo');
      if (!ride || ride.status !== 'accepted') {
        console.error('Ride not available or not accepted');
        return;
      }

      ride.status = 'in_progress';
      ride.pickupConfirmedAt = new Date();
      await ride.save();

      // Notify the student that the ride has started
      io.to(`ride_${rideId}`).emit('rideStarted', {
        student: {
          name: ride.studentId.firstName,
          phone: ride.studentId.phoneNo
        }
      });

      console.log(`Ride ${rideId} has started`);
    } catch (error) {
      console.error('Error confirming pickup:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Add this line
});

app.get('/shome', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'ride.html')); // Add this line
});
app.get('/dhome', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'rider.html')); // Add this line
});















mongoose.connect('mongodb+srv://benedictosadolor:nu32ce1PyS3TJWQM@vunadrive.xdpou.mongodb.net/?retryWrites=true&w=majority&appName=VunaDrive')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


