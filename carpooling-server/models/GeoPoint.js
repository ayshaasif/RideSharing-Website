const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoPointSchema = new Schema({
    type:{
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates : {
        type : [Number],
        required : true,
        validate : {
            validator : function(value){
                return value.length === 2;
            },
            message : ' Coordinates must contain exactly 2 values : [Longitude and Latitude] '
        }
    }
});


module.exports = GeoPointSchema;