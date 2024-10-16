const express = require('express');
const { upload, snackController } = require('../controllers/snack.controller');

const router = express.Router();

// เส้นทางสำหรับดึงข้อมูลเมนูอาหารว่างทั้งหมด
router.get('/', snackController.getSnacks);

// เส้นทางสำหรับสร้างเมนูอาหารว่างใหม่
router.post('/', upload.single('image'), snackController.createSnack);

module.exports = router;
