const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, default: "Pending" }, // สถานะเริ่มต้นเป็น "Pending"
    numberOfPeople: { type: Number, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String, default: "" },
    paymentId: { 
        type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId เพื่อเชื่อมโยงกับ Payment
        ref: 'payment' // อ้างอิงไปยัง Payment model
    },
    amount: { type: Number, required: true },
    snackId: { type: mongoose.Schema.Types.ObjectId, ref: 'Snack' }
}, {
    timestamps: true // เพิ่ม createdAt, updatedAt ให้กับข้อมูล
});

module.exports = mongoose.model('Booking', bookingSchema);
