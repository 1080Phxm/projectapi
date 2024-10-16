const bcrypt = require('bcryptjs');
const User = require("../models/login.model");

const LoginController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // ตรวจสอบว่าข้อมูลถูกส่งมาครบหรือไม่
            if (!email || !password) {
                return res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" });
            }

            // ค้นหาผู้ใช้โดยใช้อีเมล
            const user = await User.findOne({ email }).lean();

            // ตรวจสอบว่ามีผู้ใช้หรือไม่
            if (!user) {
                return res.status(404).json({ error: "ไม่พบผู้ใช้งาน" });
            }

            // ตรวจสอบว่ารหัสผ่านถูกต้องหรือไม่ โดยใช้ bcrypt เปรียบเทียบ
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
            }

            // ส่งข้อมูลผู้ใช้กลับไป
            return res.status(200).json({
                message: "เข้าสู่ระบบสำเร็จ",
                user: {
                    username: user.username,
                    email: user.email
                }
            });

        } catch (error) {
            console.error("Login error:", error); // บันทึกข้อผิดพลาดในคอนโซล
            return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
        }
    },

    async getlogin(req, res) {
        try {
            const { email } = req.query;

            // ตรวจสอบว่ามีการส่ง `email` หรือไม่
            if (!email) {
                return res.status(400).json({ error: "กรุณาระบุอีเมล" });
            }

            // ค้นหาผู้ใช้จากฐานข้อมูล
            const user = await User.findOne({ email }).lean();

            // ถ้าไม่พบข้อมูล
            if (!user) {
                return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้งาน" });
            }

            // ส่งข้อมูลผู้ใช้กลับไป
            return res.status(200).json({
                username: user.username,
                email: user.email
            });

        } catch (error) {
            console.error("Get login error:", error); // บันทึกข้อผิดพลาดในคอนโซล
            return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
        }
    }
};

module.exports = { ...LoginController };
