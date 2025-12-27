const router = require("express").Router()
const Customer = require("../models/Customer")

router.get("/", async(req,res)=>{
  res.json(await Customer.find())
})

module.exports = router
