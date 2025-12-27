const router = require("express").Router()
const Table = require("../models/Table")

router.post("/login", async(req,res)=>{
 const t = await Table.findOne(req.body)
 if(!t) return res.status(400).send("Invalid Table")
 res.json(t)
})

const Order = require("../models/Order")

router.post("/combine", async(req,res)=>{
 const {groupId,tables} = req.body

 // mark tables grouped
 await Table.updateMany({number:{$in:tables}},{$set:{groupId,status:"GROUPED"}})

 // move existing open orders into group bill
 await Order.updateMany(
   {table:{$in:tables}, paymentStatus:"UNPAID"},
   {$set:{groupId}}
 )

 res.send("Tables Combined Successfully")
})

router.post("/combine-close", async(req,res)=>{
 const {groupId,tables} = req.body

 const orders = await Order.find({table:{$in:tables},paymentStatus:"UNPAID"})
 const total = orders.reduce((a,b)=>a+b.total,0)

 // Close all orders
 await Order.updateMany(
   {table:{$in:tables},paymentStatus:"UNPAID"},
   {$set:{paymentStatus:"PAID",status:"CLOSED"}}
 )

 // Free all tables & rotate passwords
 const newPass = Math.random().toString(36).substring(2,6).toUpperCase()
 await Table.updateMany(
   {number:{$in:tables}},
   {$set:{status:"FREE",password:newPass,groupId:null}}
 )

 res.json({total})
})


module.exports = router
