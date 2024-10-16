const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getBookingById, updateBooking, deleteBooking } = require("../controllers/booking.controller");

// เส้นทางสำหรับสร้างการจองใหม่
router.post('/', createBooking);

// เส้นทางสำหรับดึงข้อมูลการจองทั้งหมด
router.get('/bookings', getBookings);

// เส้นทางสำหรับดึงข้อมูลการจองตาม ID
router.get('/bookings/:id', getBookingById);

// เส้นทางสำหรับอัปเดตข้อมูลการจองตาม ID
router.put('/bookings/:id', updateBooking);

// เส้นทางสำหรับลบการจองตาม ID
router.delete('/bookings/:id', deleteBooking);

module.exports = router;
