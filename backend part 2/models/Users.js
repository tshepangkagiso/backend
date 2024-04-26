const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type: String, required: true},
    password:{type: String, required: true},
    roles:{type: String, default:"Employee"}, // managers,employers,admins
    active:{type:Boolean, default:true} // allows managers and admins to remove access of employees asap
});

module.exports = mongoose.model('User', userSchema);