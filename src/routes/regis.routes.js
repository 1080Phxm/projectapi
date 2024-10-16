const express = require('express');
const router = express.Router();
const Controller = require("../controllers/regis.controller.js");

/* GET home page. */
router.get("/", Controller.getregis);
router.post('/regis01', Controller.regis);

module.exports = router;
