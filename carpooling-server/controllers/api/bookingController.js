const Booking = require('../../models/Booking')
const Trip = require('../../models/Trip')


const createBooking = async (req, res) => {
    const {trip_id,passenger_id, pickup_location, seats_booked} = req.body;

    try {
        const trip = await Trip.findById(trip_id);
        if (!trip){
            return res.status(404).json({"message":"Trip Not Found"});
        }
        if (trip.seats_available  < seats_booked){
            return res.status(409).json({"message":"Not enough seats remaining"});
        }
        if (trip.status = 'booking_closed'){
            return res.status(409).message({"message":"Booking closed"});
        }
        const total_price = trip.price_per_seat * seats_booked;

        const booking = await  Booking.create({
            trip_id,
            passenger_id, 
            pickup_location,
            seats_booked,
            total_price
        });

        trip.seats_available = trip.seats_available - seats_booked;

        trip.bookings.push(booking._id)
        if (trip.seats_available == 0){
            trip.status = 'booking_closed'
        }
        await trip.save();
        res.status(201).json(booking);

    }catch (error) {
        res.status(500).json({
            "message":"An error occured while booking your trip"
        });
    }
};


module.exports = {createBooking}
