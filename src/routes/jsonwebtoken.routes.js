const express = require('express');
const authMiddleware = require('./auth.middleware'); // นำเข้า middleware
const reserveController = require('./reserve.controller'); // นำเข้า controller

const router = express.Router();

router.post('/create-booking', authMiddleware, reserveController.createBooking); // ต้องใช้ JWT
router.get('/user-bookings', authMiddleware, reserveController.getUserBookings); // ต้องใช้ JWT

module.exports = router;
