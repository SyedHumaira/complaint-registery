// File: backend/Schema.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

///////////////// User Schema ///////////////////////////////
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name is required' },
    email: {
      type: String,
      required: 'Email is required',
      unique: true,
      lowercase: true // ✅ normalize
    },
    password: { type: String, required: 'Password is required' },
    phone: { type: Number, required: 'Phone is required' },
    userType: { type: String, required: 'UserType is required' },
  },
  { timestamps: true }
);

// ✅ Hash password before saving (just once)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

const UserSchema = mongoose.model("user_Schema", userSchema);

/////////////// Complaint Schema ///////////////////
const complaintSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user_Schema", required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    comment: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const ComplaintSchema = mongoose.model("complaint_schema", complaintSchema);

/////////// Assigned Complaint Schema ////////////////////////
const assignedComplaint = new mongoose.Schema(
  {
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "user_Schema", required: true },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "complaint_schema", required: true },
    status: { type: String, default: "pending" },
    agentName: { type: String, required: true },
  },
  { timestamps: true }
);

const AssignedComplaint = mongoose.model("assigned_complaint", assignedComplaint);

//////////////////// Chat Message Schema ///////////////////////////
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: 'Name is required' },
    message: { type: String, required: 'Message is required' },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "assigned_complaint" },
  },
  { timestamps: true }
);

const MessageSchema = mongoose.model("message", messageSchema);

module.exports = {
  UserSchema,
  ComplaintSchema,
  AssignedComplaint,
  MessageSchema,
};

