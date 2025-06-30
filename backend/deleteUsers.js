// File: backend/deleteUsers.js
const mongoose = require("mongoose");
require("dotenv").config();

const {
  UserSchema,
  ComplaintSchema,
  AssignedComplaint,
  MessageSchema
} = require("./Schema");

async function deleteAllData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/details");
    console.log("✅ Connected to MongoDB");

    // Delete in safe order (dependent collections first)
    const assignedDel = await AssignedComplaint.deleteMany({});
    const complaintsDel = await ComplaintSchema.deleteMany({});
    const messagesDel = await MessageSchema.deleteMany({});
    const usersDel = await UserSchema.deleteMany({});

    console.log(`🗑️ Assigned complaints deleted: ${assignedDel.deletedCount}`);
    console.log(`🗑️ Complaints deleted: ${complaintsDel.deletedCount}`);
    console.log(`🗑️ Chat messages deleted: ${messagesDel.deletedCount}`);
    console.log(`🗑️ Users deleted: ${usersDel.deletedCount}`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error deleting data:", err);
  }
}

deleteAllData();


