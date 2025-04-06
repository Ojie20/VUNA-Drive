const express = require('express');
const router = express.Router();
const User = require('../models/User');
const RideRequest = require('../models/Riderequest');
const Notification = require('../models/Notification');
const Destination = require('../models/Destination');
const socket = require('../socket');



router.get('/destinations', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.status(200).json(destinations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/request-ride', async (req, res) => {
    const { studentId, Pickup, Dropoff } = req.body;
    const io = socket.getIo()

    try {
        const rideRequest = new RideRequest({
            studentId,
            Pickup,
            Dropoff
        });

        const newride = await rideRequest.save();

        // Fetch populated ride data
        const populatedRide = await RideRequest.findById(newride._id)
            .populate('studentId', 'phoneNo')
            .populate('Pickup', 'name')
            .populate('Dropoff', 'name');
        if (populatedRide) { console.log("populatedride" + populatedRide); }
        // Emit to all drivers
        io.to('driversRoom').emit('newRideRequest', populatedRide);

        res.status(201).json({ message: 'Ride requested successfully', rideId: newride._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/accept-ride/:rideId', async (req, res) => {
    const { rideId } = req.params;
    const { driverId } = req.body;
    const io = socket.getIo()

    try {
        let ride = await RideRequest.findById(rideId);
        if (!ride || ride.status !== 'pending') {
            return res.status(400).json({ error: "Ride not available" });
        }

        ride.driverId = driverId;
        ride.status = 'accepted';
        ride.acceptedAt = new Date();

        await ride.save();

        ride = await RideRequest.findById(rideId)
            .populate('driverId', 'firstName phoneNo LicensePlate');
        // Notify the student
        await Notification.create({
            userId: ride.studentId,
            message: "Your ride has been accepted by a driver!"
        });

        // Data to be emitted
        const rideAcceptedData = {
            driver: {
                name: ride.driverId.firstName,
                phone: ride.driverId.phoneNo,
                LicensePlate: ride.driverId.LicensePlate

            }
        };

        // Log the data to be emitted
        console.log('Emitting rideAccepted event with data:', rideAcceptedData);

        // Emit to specific ride room
        io.to(`ride_${rideId}`).emit('rideAccepted', rideAcceptedData);

        ride = await RideRequest.findById(rideId)
            .populate('studentId', 'firstName phoneNo');

            const StudentData = {
                student: {
                    name: ride.studentId.firstName,
                    phone: ride.studentId.phoneNo,
    
                }
            };

        res.json({ message: 'Ride accepted successfully' , StudentData});
    } catch (error) {
        console.error('Error accepting ride:', error);
        res.status(500).json({ error: 'Error accepting ride' });
    }
});

router.post('/complete-ride/:rideId', async (req, res) => {
    const { rideId } = req.params;
    const io = socket.getIo()
    console.log(rideId)
    try {
        const ride = await RideRequest.findById(rideId)
            .populate('driverId', 'firstName accNo bank');
        if (!ride || ride.status !== 'in_progress') return res.status(400).json({ error: "Ride not in progress" });

        ride.status = 'completed';
        ride.completedAt = new Date();

        await ride.save();

        let data ={
            driver: {
                name: ride.driverId.firstName,
                accountNumber: ride.driverId.accNo,
                bank: ride.driverId.bank
            }
        };
        // Emit completion event with payment details
        io.to(`ride_${rideId}`).emit('rideCompleted', data);

        res.json({ message: 'Ride completed successfully' });
    } catch (error) {
        console.error('Error completing ride:', error);
        res.status(500).json({ error: 'Error completing ride' });
    }
});

router.post('/cancel-ride/:rideId', async (req, res) => {
    const { rideId } = req.params;
    const io = socket.getIo()

    const ride = await RideRequest.findById(rideId);
    if (!ride || ride.status !== 'pending') return res.status(400).json({ error: "Ride not available for cancellation" });

    ride.status = 'cancelled';
    ride.cancelledAt = new Date();

    await ride.save();

    // Notify the student and driver if assigned
    await Notification.create({ userId: ride.studentId, message: "Your ride has been cancelled." });
    if (ride.driverId) {
        await Notification.create({ userId: ride.driverId, message: "The ride has been cancelled." });
    }

    res.json({ message: 'Ride cancelled successfully' });
});

router.get('/pending', async (req, res) => {
    try {
        const pendingRides = await RideRequest.find({ status: 'pending' })
            .populate('studentId', 'phoneNo')
            .populate('Pickup', 'name')
            .populate('Dropoff', 'name');
        res.status(200).json(pendingRides);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;