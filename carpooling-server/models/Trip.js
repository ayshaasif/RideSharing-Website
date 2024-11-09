const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    // values that are constant but can be updated 
    driver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle: {
      model: { type: String, required: true },
      license_plate: { type: String, required: true },
      color: { type: String }
    },
    route: {
      start_location: { type: String, required: true },
      end_location: { type: String, required: true },
    },
    total_seats: { type: Number, required: true }, // capacity of the bus
    price_per_seat: { type: Number, required: true },
    start_date_time: { type: Date, required: true },
    end_date_time : { type: Date, required: false },
    // property that will be updated
    // properties that will be computed 
    bookings : [{type: Schema.Types.ObjectId , ref : 'Booking', default: []}], 
    seats_available: { type: Number, required: true }, // remaining seats after booking
    carpool_route : {
      waypoints: [String],
      distance: { type: Number },
      duration: { type: Number }
    },
    status: { type: String, enum: ['booking_started','scheduled', 'completed', 'canceled','booking_closed'], default: 'scheduled' }
  });
  
  module.exports = mongoose.model('Trip', tripSchema);
  