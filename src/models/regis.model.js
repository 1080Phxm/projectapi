const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "กรุณาระบุชื่อผู้ใช้"], // บังคับให้ต้องกรอก
        trim: true,  // ลบช่องว่างหน้าหลังอัตโนมัติ
        minlength: [3, "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"],
        maxlength: [50, "ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร"],
    },
    email: {
        type: String,
        required: [true, "กรุณาระบุอีเมล"], // บังคับให้ต้องกรอก
        unique: true, // ไม่ให้อีเมลซ้ำกัน
        trim: true,  // ลบช่องว่างหน้าหลังอัตโนมัติ
        match: [/.+\@.+\..+/, "กรุณาระบุอีเมลที่ถูกต้อง"], // ตรวจสอบรูปแบบอีเมล
    },
    password: {
        type: String,
        required: [true, "กรุณาระบุรหัสผ่าน"], // บังคับให้ต้องกรอก
        minlength: [6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"],
    },
}, {
    timestamps: true // เพิ่มฟิลด์ createdAt และ updatedAt อัตโนมัติ
});

const Regis = mongoose.model('Regis', userSchema);

module.exports = Regis;
