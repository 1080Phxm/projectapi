const bcrypt = require('bcryptjs'); // นำเข้า bcrypt สำหรับการเข้ารหัสรหัสผ่าน
const mRegis = require("../models/regis.model");
const User = require("../models/login.model");

const Controller = {
  async regis(req, res) {
    try {
      const { username, email, password } = req.body;

      // ตรวจสอบว่าข้อมูลที่จำเป็นถูกส่งมาครบหรือไม่
      if (!username || !email || !password) {
        return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      }

      // ตรวจสอบว่ามีอีเมลซ้ำหรือไม่
      const existingUser = await mRegis.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: "คุณได้ลงทะเบียนแล้วด้วยอีเมลนี้" });
      }

      // เข้ารหัสรหัสผ่านก่อนบันทึก
      const saltRounds = 10; // จำนวนรอบการเข้ารหัส
      const hashedPassword = await bcrypt.hash(password, saltRounds); // เข้ารหัสรหัสผ่าน

      // สร้างผู้ใช้ใหม่ในโมเดล regis
      const newRegisUser = await mRegis.create({ username, email, password: hashedPassword });
      console.log("User created in regis:", newRegisUser); // แสดงข้อมูลผู้ใช้ใหม่

      // สร้างผู้ใช้ใหม่ในโมเดล login
      const newUser = await User.create({ username, email, password: hashedPassword });
      console.log("User created in login:", newUser); // แสดงข้อมูลผู้ใช้ใหม่ใน login

      // เข้าสู่ระบบทันทีหลังจากลงทะเบียนสำเร็จ
      return res.status(201).json({
        message: "ลงทะเบียนและเข้าสู่ระบบสำเร็จ",
        user: {
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getregis(req, res) {
    try {
      const { username } = req.query;

      if (!username) {
        return res.status(400).json({ error: "กรุณาระบุชื่อผู้ใช้" });
      }

      const result = await mRegis.find({ username });

      if (result.length === 0) {
        return res.status(404).json({ message: "ไม่พบข้อมูล" });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = { ...Controller };
