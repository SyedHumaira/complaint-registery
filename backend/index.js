// File: backend/index.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const {
  ComplaintSchema,
  UserSchema,
  AssignedComplaint,
  MessageSchema,
} = require("./Schema");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/details")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Socket.IO
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// SignUp
app.post("/SignUp", async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;
    const user = new UserSchema({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      userType
    });

    const resultUser = await user.save();
    console.log("User registered:", resultUser.email);
    res.status(201).send(resultUser);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({ error: "Signup failed" });
  }
});

// Login
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserSchema.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    console.log("Login successful for:", user.email);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// Messages
app.post("/messages", async (req, res) => {
  try {
    const { name, message, complaintId } = req.body;
    const messageData = new MessageSchema({ name, message, complaintId });
    const messageSaved = await messageData.save();
    res.status(200).json(messageSaved);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/messages/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const messages = await MessageSchema.find({ complaintId }).sort("-createdAt");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

// Fetch users
app.get("/AgentUsers", async (req, res) => {
  try {
    const users = await UserSchema.find({ userType: "Agent" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/OrdinaryUsers", async (req, res) => {
  try {
    const users = await UserSchema.find({ userType: "Ordinary" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/AgentUsers/:agentId", async (req, res) => {
  try {
    const user = await UserSchema.findOne({ _id: req.params.agentId });
    if (user && user.userType === "Agent") return res.status(200).json(user);
    res.status(404).json({ error: "Agent not found" });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete user + complaints
app.delete("/OrdinaryUsers/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await UserSchema.deleteOne({ _id: req.params.id });
    await ComplaintSchema.deleteMany({ userId: req.params.id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Register complaint + Emit via Socket.IO
app.post("/Complaint/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const complaint = new ComplaintSchema({
      ...req.body,
      userId: req.params.id,
      status: "pending"
    });

    const result = await complaint.save();
    io.emit("newComplaint", result); // ✅ Emit real-time update
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

// Status (user & all)
app.get("/status/:id", async (req, res) => {
  try {
    const complaints = await ComplaintSchema.find({ userId: req.params.id });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve complaints" });
  }
});

app.get("/status", async (req, res) => {
  try {
    const complaints = await ComplaintSchema.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve complaints" });
  }
});

// Delete & Update complaints
app.delete("/Complaint/:id", async (req, res) => {
  try {
    const deleted = await ComplaintSchema.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Complaint not found" });
    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete complaint" });
  }
});

app.put("/Complaint/:id", async (req, res) => {
  try {
    const updated = await ComplaintSchema.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Complaint not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

// Assign & track assigned complaints
app.post("/assignedComplaints", async (req, res) => {
  try {
    const assignment = await AssignedComplaint.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign complaint" });
  }
});

app.get("/allcomplaints/:agentId", async (req, res) => {
  try {
    const complaints = await AssignedComplaint.find({ agentId: req.params.agentId });
    const complaintIds = complaints.map(c => c.complaintId);
    const details = await ComplaintSchema.find({ _id: { $in: complaintIds } });

    const merged = complaints.map(ac => {
      const match = details.find(d => d._id.toString() === ac.complaintId.toString());
      return { ...ac._doc, ...match?._doc };
    });

    res.json(merged);
  } catch (error) {
    res.status(500).json({ error: "Failed to get complaints" });
  }
});

// Admin update user info
app.put("/user/:_id", async (req, res) => {
  try {
    const user = await UserSchema.findByIdAndUpdate(req.params._id, req.body, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Agent update complaint status
app.put("/complaint/:complaintId", async (req, res) => {
  try {
    const updated = await ComplaintSchema.findByIdAndUpdate(
      req.params.complaintId,
      { status: req.body.status },
      { new: true }
    );
    await AssignedComplaint.findOneAndUpdate(
      { complaintId: req.params.complaintId },
      { status: req.body.status }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server + Socket.IO running on port ${PORT}`);
});


