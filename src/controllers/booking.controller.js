const moment = require('moment'); // นำเข้า moment.js
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model"); // เพิ่มการนำเข้า Payment Model
const { generateTimeSlots } = require('./reserve.controller');

const BookingController = {
    // สร้างการจองใหม่
    async createBooking(req, res) {
        try {
            const { date, time, numberOfPeople, customerName, phone, note } = req.body;

            // ตรวจสอบข้อมูลที่จำเป็น
            if (!date || !time || !numberOfPeople || !customerName || !phone) {
                return res.status(400).json({ error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" });
            }

            // แปลงวันที่จาก dd/mm/yyyy เป็น Date
            const formattedDate = moment(date, 'DD/MM/YYYY').toDate();
            if (!moment(formattedDate).isValid()) {
                return res.status(400).json({ error: "วันที่ไม่ถูกต้อง" });
            }

            // สร้าง time slots
            const slots = generateTimeSlots();

            // ตรวจสอบว่าช่วงเวลาที่เลือกมีอยู่ใน time slots หรือไม่
            if (!slots.includes(time)) {
                return res.status(400).json({ error: "ช่วงเวลานี้ไม่สามารถจองได้" });
            }

            // ตรวจสอบว่าช่วงเวลาที่เลือกถูกจองไปแล้วหรือยัง
            const existingBooking = await Booking.findOne({ date: formattedDate, time });
            if (existingBooking) {
                return res.status(400).json({ error: "ช่วงเวลานี้ถูกจองแล้ว" });
            }

            // สร้างการจองใหม่
            const newBooking = await Booking.create({
                date: formattedDate,
                time,
                status: "Pending",
                numberOfPeople,
                customerName,
                phone,
                note
            });

            return res.status(201).json({
                message: "การจองสำเร็จ",
                booking: newBooking
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // ดึงข้อมูลการจองทั้งหมด
    async getBookings(req, res) {
        try {
            const bookings = await Booking.find().populate('paymentId'); // เพิ่ม populate เพื่อให้ได้ข้อมูลการชำระเงินด้วย

            // ตรวจสอบว่ามีการจองหรือไม่
            if (bookings.length === 0) {
                return res.status(404).json({ message: "ไม่พบข้อมูลการจอง" });
            }

            return res.status(200).json(bookings);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // ดึงข้อมูลการจองตาม ID
    async getBookingById(req, res) {
        try {
            const { id } = req.params;
            const booking = await Booking.findById(id).populate('paymentId'); // เพิ่ม populate

            if (!booking) {
                return res.status(404).json({ error: "ไม่พบข้อมูลการจอง" });
            }

            return res.status(200).json(booking);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // อัปเดตข้อมูลการจอง
    async updateBooking(req, res) {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            // ตรวจสอบว่ามีการจองอยู่ก่อนที่จะอัปเดต
            const booking = await Booking.findById(id);
            if (!booking) {
                return res.status(404).json({ error: "ไม่พบข้อมูลการจอง" });
            }

            // อัปเดตข้อมูลการจอง
            Object.assign(booking, updatedData); // ใช้ Object.assign เพื่ออัปเดตข้อมูล
            await booking.save(); // บันทึกการเปลี่ยนแปลง

            return res.status(200).json({
                message: "อัปเดตข้อมูลการจองสำเร็จ",
                booking
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // ลบการจอง
    async deleteBooking(req, res) {
        try {
            const { id } = req.params;

            const booking = await Booking.findByIdAndDelete(id);

            if (!booking) {
                return res.status(404).json({ error: "ไม่พบข้อมูลการจอง" });
            }

            return res.status(200).json({ message: "ลบการจองสำเร็จ" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { ...BookingController };
