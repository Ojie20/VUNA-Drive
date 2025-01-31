const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Pickup: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Destination', 
        required: true 
    },
    Dropoff: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Destination', 
        required: true 
    },
    driverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'completed', 'canceled'], 
        default: 'pending' 
    },
    requestedAt: { 
        type: Date, 
        default: Date.now 
    },
    acceptedAt: { 
        type: Date 
    },
    completedAt: { 
        type: Date 
    }
});

const RideRequest = mongoose.model('RideRequest', rideRequestSchema);
module.exports = RideRequest;
