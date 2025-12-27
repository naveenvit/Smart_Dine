const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SmartDine Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
const Table = require("./models/Table");
// CREATE FIXED NUMBER OF TABLES (RUN ONLY ONCE)
app.post("/init-tables", async (req, res) => {
  try {
    const { totalTables } = req.body;

    if (!totalTables) {
      return res.status(400).json({ message: "Total tables required" });
    }

    const existingTables = await Table.countDocuments();
    if (existingTables > 0) {
      return res
        .status(400)
        .json({ message: "Tables already initialized" });
    }

    let tables = [];

    for (let i = 1; i <= totalTables; i++) {
      tables.push({
        tableNumber: i,
        password: Math.floor(1000 + Math.random() * 9000).toString(), // 4-digit password
        status: "FREE",
        currentOrderTotal: 0,
        combinedWith: []
      });
    }

    await Table.insertMany(tables);
    res.json({ message: `${totalTables} tables created successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET ALL TABLES (FOR MAIN PORTAL)
app.get("/tables", async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// LOGIN / BOOK TABLE
app.post("/book-table", async (req, res) => {
  try {
    const { tableNumber, password } = req.body;

    if (!tableNumber || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const table = await Table.findOne({ tableNumber });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (table.status === "OCCUPIED") {
      return res.status(400).json({ message: "Table already occupied" });
    }

    if (table.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    table.status = "OCCUPIED";
    await table.save();

    res.json({ message: "Table booked successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const Customer = require("./models/Customer");

// CREATE CUSTOMER
app.post("/create-customer", async (req, res) => {
  try {
    const { phone, tableNumber } = req.body;

    if (!phone || !tableNumber) {
      return res.status(400).json({ message: "All fields required" });
    }

    await Customer.create({ phone, tableNumber });

    res.json({ message: "Customer created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const Order = require("./models/Order");

// CREATE ORDER (SEND TO KITCHEN)
app.post("/create-order", async (req, res) => {
  try {
    const { tableNumber, items, total } = req.body;

    if (!tableNumber || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

await Order.create({
  tableNumber,
  items,
  total
});

await Table.findOneAndUpdate(
  { tableNumber },
  { $inc: { currentOrderTotal: total } }
);


    res.json({ message: "Order sent to kitchen" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// CONFIRM PAYMENT
app.post("/confirm-payment", async (req, res) => {
  try {
    const { tableNumber } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ message: "Table number required" });
    }

    // Mark orders as PAID
    await Order.updateMany(
      { tableNumber, status: "PENDING" },
      { status: "PAID" }
    );

    // Generate new password
    const newPassword = Math.floor(1000 + Math.random() * 9000).toString();

    // Reset table
    await Table.findOneAndUpdate(
      { tableNumber },
      {
        status: "FREE",
        password: newPassword,
        currentOrderTotal: 0,
        combinedWith: []
      }
    );

    res.json({
      message: "Payment successful. Thank you!",
      newPassword
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// COMBINE TABLES & PAY
app.post("/combine-tables", async (req, res) => {
  try {
    const { baseTable, combineTables } = req.body;

    if (!baseTable || !combineTables || combineTables.length === 0) {
      return res.status(400).json({ message: "Invalid table data" });
    }

    // Include base table itself
    const allTables = [baseTable, ...combineTables];

// Get all UNPAID orders of these tables
const tables = await Table.find({
  tableNumber: { $in: allTables }
});

const total = tables.reduce(
  (sum, t) => sum + (t.currentOrderTotal || 0),
  0
);


// Mark all orders as PAID
await Order.updateMany(
  { tableNumber: { $in: allTables } },
  { status: "PAID" }
);


    // Reset all tables
    for (let t of allTables) {
      const newPassword = Math.floor(1000 + Math.random() * 9000).toString();

      await Table.findOneAndUpdate(
        { tableNumber: t },
        {
          status: "FREE",
          password: newPassword,
          currentOrderTotal: 0,
          combinedWith: []
        }
      );
    }

    res.json({
      message: `Tables combined & payment successful. Total ₹${total}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

