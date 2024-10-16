const Snack = require('../models/snack.model');
const multer = require('multer');
const path = require('path');

// กำหนดที่เก็บไฟล์ที่อัปโหลด
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // โฟลเดอร์ที่ใช้เก็บไฟล์
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // ตั้งชื่อไฟล์
    }
});

const upload = multer({ storage });

// เพิ่มฟังก์ชันในการสร้างเมนูอาหารว่างใหม่
const snackController = {
    // ดึงข้อมูลเมนูอาหารว่างทั้งหมด
    async getSnacks(req, res) {
        try {
            const snacks = await Snack.find();

            if (snacks.length === 0) {
                return res.status(404).json({ message: "ไม่พบข้อมูลเมนูอาหารว่าง" });
            }

            return res.status(200).json(snacks);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // สร้างเมนูอาหารว่างใหม่
    async createSnack(req, res) {
        try {
            const { name, price, description } = req.body;
    
            // ตรวจสอบข้อมูลที่จำเป็น
            if (!name || !price) {
                return res.status(400).json({ error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" });
            }
    
            // สร้างเมนูอาหารว่างใหม่โดยไม่ต้องเก็บ URL ของรูปภาพ
            const newSnack = await Snack.create({ name, price, description });
    
            return res.status(201).json({
                message: "เพิ่มเมนูอาหารว่างสำเร็จ",
                snack: newSnack,
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // เพิ่มฟังก์ชันอื่นๆ ที่มีอยู่ตามเดิม
};

module.exports = { upload, snackController };
