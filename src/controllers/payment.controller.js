const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");

const PaymentController = {
    // สร้างการชำระเงินใหม่
    async createPayment(req, res) {
        try {
            const { bookingId, status } = req.body;

            // ตรวจสอบการจองที่สอดคล้องกับ bookingId
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ error: "ไม่พบข้อมูลการจอง" });
            }

            // คำนวณมัดจำ 30% จากจำนวนเงิน
            const deposit = booking.amount * 0.3;

            // สร้างการชำระเงินในระบบ
            const payment = await Payment.create({
                _id: booking._id, 
                bookingId: booking._id,
                status,
                amount: deposit // บันทึกมัดจำ 30%
            });

            // ถ้าการชำระเงินสำเร็จ อัปเดตสถานะการจองเป็น "Confirmed"
            if (status === "Paid") {
                booking.status = "Confirmed";  // อัปเดตสถานะการจองเป็น Confirmed
                await booking.save();  // บันทึกการเปลี่ยนแปลงสถานะ
            }

            // return ข้อมูลการชำระเงิน
            return res.status(201).json({ message: "การชำระเงินสำเร็จ", payment });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // ดึงข้อมูลการชำระเงินทั้งหมด
    async getPayments(req, res) {
        try {
            const payments = await Payment.find().populate('bookingId');

            if (payments.length === 0) {
                return res.status(404).json({ message: "ไม่พบข้อมูลการชำระเงิน" });
            }

            return res.status(200).json(payments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // ดึงข้อมูลการชำระเงินตาม ID
    async getPaymentById(req, res) {
        try {
            const { id } = req.params;

            // ตรวจสอบความยาวของ ID
            if (!id || id.length !== 24) {
                return res.status(400).json({ error: "ID ที่ระบุไม่ถูกต้อง" });
            }

            const payment = await Payment.findById(id).populate('bookingId');

            if (!payment) {
                return res.status(404).json({ error: "ไม่พบข้อมูลการชำระเงิน" });
            }

            return res.status(200).json(payment);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // อัปเดตข้อมูลการชำระเงิน
    async updatePayment(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            // ตรวจสอบความยาวของ ID
            if (!id || id.length !== 24) {
                return res.status(400).json({ error: "ID ที่ระบุไม่ถูกต้อง" });
            }

            const payment = await Payment.findByIdAndUpdate(id, updatedData, { new: true });

            if (!payment) {
                return res.status(404).json({ error: "ไม่พบข้อมูลการชำระเงิน" });
            }

            return res.status(200).json({
                message: "อัปเดตข้อมูลการชำระเงินสำเร็จ",
                payment
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // ลบการชำระเงิน
    async deletePayment(req, res) {
        try {
            const { id } = req.params;

            // ตรวจสอบความยาวของ ID
            if (!id || id.length !== 24) {
                return res.status(400).json({ error: "ID ที่ระบุไม่ถูกต้อง" });
            }

            const payment = await Payment.findByIdAndDelete(id);

            if (!payment) {
                return res.status(404).json({ error: "ไม่พบข้อมูลการชำระเงิน" });
            }

            return res.status(200).json({ message: "ลบการชำระเงินสำเร็จ" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { ...PaymentController };
