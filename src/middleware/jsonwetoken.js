const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // ดึง Token จาก Header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user; // เก็บข้อมูลผู้ใช้ใน req
    next();
  });
};

module.exports = authMiddleware;
