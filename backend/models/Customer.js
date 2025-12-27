const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
  phone:String,
  totalOrders:{type:Number, default:0}
})

module.exports = mongoose.model("Customer", customerSchema)
