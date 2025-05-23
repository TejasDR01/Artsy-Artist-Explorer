const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    password: String,
    profileImageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
