const mongoose = require('mongoose');
require('dotenv').config();

// Middleware
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const port = process.argv[2];
const app = express();
const server = require('socket.io').Server



app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Add this line
});

const user = require('./models/User');



const userRoutes = require('./routes/userRoutes');





app.use('/users', userRoutes);
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
  console.log(`Open your browser and navigate to http://localhost:${port}`); // Add this line
});





mongoose.connect('mongodb+srv://benedictosadolor:nu32ce1PyS3TJWQM@vunadrive.xdpou.mongodb.net/?retryWrites=true&w=majority&appName=VunaDrive')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
