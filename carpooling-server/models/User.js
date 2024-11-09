const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    User : {
        type: Number ,
        default : 2001
    },
    Editor :Number,
    Admin : Number
},
  profile_picture: { type: String, default : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' },
  created_at: { type: Date, default: Date.now },
  refresh_token : String
});

module.exports = mongoose.model('User', userSchema);
