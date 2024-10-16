const express = require('express');
const router = express.Router();
const Controller = require("../controllers/login.controller.js");

/* GET home page. */
router.get("/", Controller.getlogin);
router.post('/login01', Controller.login);

module.exports = router;
