const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        required: [true, "กรุณาระบุอีเมล"],
        unique: true, 
        trim: true,  
        match: [/.+\@.+\..+/, "กรุณาระบุอีเมลที่ถูกต้อง"], 
    },
    password: {
        type: String,
        required: [true, "กรุณาระบุรหัสผ่าน"], 
        minlength: [6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"],
    },
}, {
    timestamps: true 
});

const Login = mongoose.model('Login', userSchema);

module.exports = Login;
