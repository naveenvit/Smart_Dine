const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
 table:String,
 groupId:String,
 items:Array,
 total:Number,
 phone:String,
 status:{type:String, default:"OPEN"},
 paymentStatus:{type:String, default:"UNPAID"},
 payments:[Number],
 created:{type:Date, default:Date.now}
})

module.exports = mongoose.model("Order", orderSchema)
