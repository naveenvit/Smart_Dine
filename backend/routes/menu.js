const router = require("express").Router()
const Menu = require("../models/Menu")

router.get("/", async(req,res)=>{
  res.json(await Menu.find())
})

module.exports = router
