const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    trip_id: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    passenger_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pick_up_location : {type: String, required: true},
    seats_booked: { type: Number, required: true },
    total_price: { type: Number, required: true },
    booking_date: { type: Date, default: Date.now },
    status: { type: String, enum: ['confirmed', 'canceled'], default: 'confirmed' }
  });
  
  module.exports = mongoose.model('Booking', bookingSchema);
  