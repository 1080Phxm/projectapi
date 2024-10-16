const mongoose = require('mongoose');

// สร้าง Schema สำหรับการจอง (Reservation)
const reservationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    },
    numberOfPeople: {
        type: Number,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    note: {
        type: String,
        default: ''
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment' // อ้างอิงไปยังโมเดล Payment
    },
    amount: { // เพิ่มฟิลด์สำหรับราคา
        type: Number,
        required: true
    }
}, { timestamps: true }); // เพิ่ม timestamp สำหรับ createdAt และ updatedAt


// ป้องกันการจองซ้ำในช่องเวลาเดียวกัน
reservationSchema.index({ slot: 1, date: 1 }, { unique: true });

// สร้างโมเดล Reservation
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
