// routes/payment.routes.js
const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller.js');

// สร้างการชำระเงินใหม่
router.post('/', PaymentController.createPayment);

// ดึงข้อมูลการชำระเงินทั้งหมด
router.get('/', PaymentController.getPayments);

// ดึงข้อมูลการชำระเงินตาม ID
router.get('/:id', PaymentController.getPaymentById);

// อัปเดตการชำระเงิน
router.put('/:id', PaymentController.updatePayment);

// ลบการชำระเงิน
router.delete('/:id', PaymentController.deletePayment);

module.exports = router;
