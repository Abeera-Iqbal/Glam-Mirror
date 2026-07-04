const mongoose = require('mongoose');

// Yeh hamara naksha (Blueprint) hai
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'] // Agar naam nahi diya to error aayega
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true // Email duplicate nahi ho sakti
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    loginCount: {
  type: Number,   //login kitni baar kiya hai
  default: 0
},

lastLogin: {
  type: Date
},
}, {
    timestamps: true // Yeh khud record karega ke user kab bana (Date & Time)
});

module.exports = mongoose.model('User', userSchema);