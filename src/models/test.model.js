const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
    },
    surname: {
        type: String,
        default: "",
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
