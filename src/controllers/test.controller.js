const mTest = require("../models/test.model")

Controller = {
    async test(req, res) {
        const { name, surname } = req.body

        const newUser = await mTest.create({ name, surname });
        return res.status(201).json("เพิ่มข้อมูลสำเร็จ");
    },
    async getTest(req, res) {
        try {

            const { name } = req.query

            
            const test = await mTest.find({ name })
            
            return res.status(200).json(test)

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = { ...Controller }


       