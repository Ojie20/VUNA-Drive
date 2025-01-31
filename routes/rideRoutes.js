const express = require('express');
const router = express.Router();
const User = require('../models/User');
const RideRequest = require('../models/Riderequest');
const Notification = require('../models/Notification');
const Destination = require('../models/Destination');

router.get('/destinations', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.status(200).json(destinations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/request-ride', async (req, res) => {
    const { studentId,Pickup,Dropoff, destinationId } = req.body;

    const rideRequest = new RideRequest({
        studentId,
        Pickup,
        Dropoff
    });

    await rideRequest.save();

    // Notify drivers
    const drivers = await User.find({ role: 'driver', isAvailable: true });
    drivers.forEach(async (driver) => {
        await Notification.create({ userId: driver._id, message: "New ride request available!" });
    });

    res.status(201).json({ message: 'Ride requested successfully' });
});


router.post('/accept-ride/:rideId', async (req, res) => {
    const { rideId } = req.params;
    const { driverId } = req.body;

    const ride = await RideRequest.findById(rideId);
    if (!ride || ride.status !== 'pending') return res.status(400).json({ error: "Ride not available" });

    ride.driverId = driverId;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();

    await ride.save();

    // Notify the student
    await Notification.create({ userId: ride.studentId, message: "Your ride has been accepted by a driver!" });

    res.json({ message: 'Ride accepted successfully' });
});

router.post('/complete-ride/:rideId', async (req, res) => {
    const { rideId } = req.params;

    const ride = await RideRequest.findById(rideId);
    if (!ride || ride.status !== 'accepted') return res.status(400).json({ error: "Ride not in progress" });

    ride.status = 'completed';
    ride.completedAt = new Date();

    await ride.save();

    res.json({ message: 'Ride completed successfully' });
});

module.exports = router;