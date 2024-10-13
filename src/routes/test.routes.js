const express = require('express');
const router = express.Router();
const Controller = require("../controllers/test.controller.js")

/* GET home page. */
router.get("/", Controller.getTest)
router.post('/test01',Controller.test);


module.exports = router;
