const router = require("express").Router()
const Order = require("../models/Order")
const Table = require("../models/Table")
const Customer = require("../models/Customer")
async function saveCustomer(phone){
 if(!phone) return
 const Customer = require("../models/Customer")
 let c = await Customer.findOne({phone})
 if(!c) await Customer.create({phone})
}

router.post("/add", async(req,res)=>{
 const {table,item,price,phone,groupId} = req.body

 // STRICT table isolation
 let q = groupId
   ? { groupId, paymentStatus:"UNPAID" }
   : { table, groupId:{ $exists:false }, paymentStatus:"UNPAID" }

 let o = await Order.findOne(q)

 if(!o){
   o = await Order.create({
     table,
     groupId,
     items:[item],
     total:price,
     phone,
     payments:[]
   })
 }else{
   o.items.push(item)
   o.total += price
   await o.save()
 }

 res.json(o)
})


router.put("/split/:id", async(req,res)=>{
 const o = await Order.findById(req.params.id)

 let totalPaid = req.body.payments.reduce((a,b)=>a+b,0)
 if(totalPaid != o.total) return res.status(400).send("Total mismatch")

 // close order
 o.payments = req.body.payments
 o.paymentStatus = "PAID"
 o.status = "CLOSED"
 await o.save()

 // free tables & rotate password
 const newPass = Math.random().toString(36).substring(2,6).toUpperCase()

 if(o.groupId){
   await Table.updateMany(
     { groupId: o.groupId },
     { status:"FREE", groupId:null, password:newPass }
   )
 }else{
   await Table.findOneAndUpdate(
     { number: o.table },
     { status:"FREE", password:newPass }
   )
 }

 // DO NOT return password
 res.json({ msg:"Payment completed successfully" })
})


router.put("/close/:id", async(req,res)=>{
 const o = await Order.findById(req.params.id)
 o.paymentStatus="PAID"
 o.status="CLOSED"
 await o.save()

 const newPass = Math.random().toString(36).substring(2,6).toUpperCase()
 await Table.findOneAndUpdate({number:o.table},{status:"FREE",password:newPass})

 res.json({msg:"Payment completed"})
})
router.post("/call", async(req,res)=>{
 await Order.create({table:req.body.table,status:"CALL"})
 res.send("Waiter Notified")
})

router.get("/", async(req,res)=>res.json(await Order.find()))
module.exports = router
