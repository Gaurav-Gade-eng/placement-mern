require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/admin");
const resumeRoutes = require("./routes/resumeRoutes");
const studentRoutes = require("./routes/studentRoutes");



const app = express();

/* DATABASE */
connectDB();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* API ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/student", studentRoutes);
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/chat", chatRoutes);

/* STATIC FILES */
app.use("/uploads", express.static("uploads"));
/* ROOT TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Placement Portal API running...");
});

/* SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

