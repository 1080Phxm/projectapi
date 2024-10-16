const dayjs = require("dayjs");
const Booking = require("../models/booking.model");
const Snack = require("../models/snack.model");

const generateTimeSlots = () => {
    const slots = [];
    const startHour = 10; // เริ่มต้นที่ 10 โมงเช้า
    const endHour = 20; // สิ้นสุดที่ 20 โมง (8 โมงเย็น)

    for (let hour = startHour; hour < endHour; hour += 2) { // เพิ่มทีละ 2 ชั่วโมง
        const startTime = dayjs().hour(hour).minute(0).format("HH:mm");
        const endTime = dayjs().hour(hour + 2).minute(0).format("HH:mm"); // เวลาสิ้นสุดเพิ่มอีก 2 ชั่วโมง
        slots.push(`${startTime}-${endTime}`);
    }

    return slots;
};

const reserveController = {
    // สร้างการจองใหม่
    async createBooking(req, res) {
        try {
            const { date, time, numberOfPeople, customerName, phone, note, snackId } = req.body;

            // ตรวจสอบข้อมูลที่จำเป็น
            if (!date || !time || !numberOfPeople || !customerName || !phone) {
                return res.status(400).json({ error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" });
            }

            // แปลงวันที่จาก dd/mm/yyyy เป็น Date
            const formattedDate = dayjs(date, "DD/MM/YYYY").toDate();
            if (!dayjs(formattedDate).isValid()) {
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

            // ตรวจสอบว่ามีอาหารว่างที่เลือกอยู่หรือไม่
            let snackPrice = 0;
            if (snackId) {
                const snack = await Snack.findById(snackId);
                if (!snack) {
                    return res.status(400).json({ error: "ไม่พบเมนูอาหารว่างที่เลือก" });
                }
                snackPrice = snack.price; // ดึงราคาจากอาหารว่าง
            }

            // คำนวณราคา
            const amount = numberOfPeople * 1000 + snackPrice; // ราคา 1000 บาทต่อคน + ราคาของอาหารว่าง

            // สร้างการจองใหม่
            const newBooking = await Booking.create({
                date: formattedDate,
                time,
                status: "Pending",
                numberOfPeople,
                customerName,
                phone,
                note,
                amount,
                snackId // เพิ่ม snackId ในการจอง
            });

            // ส่งข้อมูลการจองกลับไปที่ client
            return res.status(201).json({
                message: "การจองสำเร็จ",
                booking: newBooking,
                amount: newBooking.amount, // ส่งจำนวนเงินทั้งหมด
            });

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    

    // ดึงข้อมูลการจองทั้งหมด
    async getBookings(req, res) {
        try {
            const bookings = await Booking.find(); // เพิ่ม populate ถ้าต้องการ

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
            const booking = await Booking.findById(id); // เพิ่ม populate ถ้าต้องการ

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
                booking,
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
    },

    // ดึงข้อมูลช่องเวลาที่ว่าง
    async getAvailableSlots(req, res) {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ error: "กรุณาเลือกวันที่" });
            }

            const slots = generateTimeSlots();

            const formattedDate = dayjs(date, "YYYY-MM-DD").toDate();
            const reservedSlots = await Booking.find({ date: formattedDate }).select("time");

            const availableSlots = slots.filter((slot) => {
                const [startTime, endTime] = slot.split("-");
                return !reservedSlots.some((res) => {
                    const reservedTime = res.time;
                    return reservedTime >= startTime && reservedTime < endTime;
                });
            });

            return res.status(200).json({ availableSlots });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};

module.exports = reserveController;
