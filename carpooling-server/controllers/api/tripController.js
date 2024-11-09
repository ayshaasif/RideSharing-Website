const Trip = require('../../models/Trip');

const getAllTrips = async(req,res)=>{
    const trips = await Trip.find();
    if (!trips)  
        return res.status(204).json({"message": "No trip found..."})
    res.status(201).json(trips)
}

const getTrip = async(req,res)=>{
    if (!req?.params?.id){
        return res.status(400).json({"message":"Id parameter is required"});
    }
    const trip = await Trip.findOne({_id : req.params.id}).exec();
    if (!trip){
        return res.status(400).json({"message":`Trip Id ${req.params.id} not found`})
    }
    res.json(trip);
}

const createTrip = async(req,res) => {
    if(!req?.body){
        return res.status(400).json({"message":"fields required"});
    }
    const {driver_id, vehicle_model, v_license_plate, v_color,start_loc, end_loc, num_Seats, price_ps,trip_day} =  req.body;
    try {
        // Create a new trip document
        const trip = await Trip.create({
            driver_id,
            vehicle: {
                model: vehicle_model,
                license_plate: v_license_plate,
                color: v_color
            },
            route: {
                start_location: start_loc,
                end_location: end_loc
            },
            seats_available: num_Seats,
            price_per_seat: price_ps,
            date_time: new Date(trip_day),
            carpool_route: {
                waypoints: waypoints || [],
                distance: distance || null,
                duration: duration || null
            },
            bookings: [],  // initialize with an empty array if no bookings yet
            status: 'scheduled'  // default value
        });

        res.status(201).json({ message: 'Trip created successfully', trip });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: 'Failed to create trip', error: error.message });
    }
}

const updateTrip = async(req, res)=>{
    if (!req?.params?.id){
        return res.status(400).json({"message":"Id parameter is required"});
    }
    const trip = await Trip.findOne({_id : req.params.id}).exec();
    if (!trip){
        return res.status(400).json({"message":`trip Id ${req.params.id} not found`})
    }
    if(req.body?.driver_id) trip.driver_id = req.body.driver_id;
    if(req.body?.route?.start_location) trip.route.start_location = req.trip.route.start_location;
    if(req.body?.route?.end_location) trip.route.end_location = req.trip.route.end_location;
    if(req.body?.date_time) trip.date_time = req.body.date_time;
}

const deleteTrip = async(req, res) => {
    if (!req?.params?.id){
        return res.status(400).json({"message":"Id parameter is required"});
    }
    const trip = await Trip.findOne({_id : req.params.id}).exec();
    if (!trip){
        return res.status(400).json({"message":`Trip Id ${req.params.id} not found`})
    }

    const result = await Trip.deleteOne({_id: req.body.id});
    res.json(result);
}

module.exports = {
    getAllTrips,
    createTrip,
    getTrip,
    updateTrip,
    deleteTrip
}