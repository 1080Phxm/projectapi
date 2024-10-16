// models/payment.model.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking', // อ้างอิงไปยังโมเดล Booking
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // เพิ่ม timestamp สำหรับ createdAt และ updatedAt

const Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;
