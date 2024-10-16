const express = require('express');
const reserveController = require('../controllers/reserve.controller'); // นำเข้า Reserve Controller

const router = express.Router();

// Route สำหรับสร้างการจองใหม่
router.post('/bookings', reserveController.createBooking);

// Route สำหรับดึงข้อมูลการจองทั้งหมด
router.get('/bookings', reserveController.getBookings);

// Route สำหรับดึงข้อมูลการจองตาม ID
router.get('/bookings/:id', reserveController.getBookingById);

// Route สำหรับอัปเดตข้อมูลการจอง
router.put('/bookings/:id', reserveController.updateBooking);

// Route สำหรับลบการจอง
router.delete('/bookings/:id', reserveController.deleteBooking);

// Route สำหรับดึงข้อมูลช่องเวลาที่ว่าง
router.get('/available-slots', reserveController.getAvailableSlots);

module.exports = router;
