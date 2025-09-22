const authRoutes = require("./auth");
app.use("/auth", authRoutes);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import Models
const User = require("./models/User");
const Opportunity = require("./models/Opportunity");
const Application = require("./models/Application");

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Default route
app.get("/", (req, res) => {
  res.send("QuickChanceApp Backend is running 🚀");
});

// =================== AUTH ===================

// LOGIN route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =================== USERS ===================

// CREATE user
app.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =================== OPPORTUNITIES CRUD ===================

// CREATE Opportunity
app.post("/opportunities", async (req, res) => {
  try {
    const { title, description, companyId, type, location, deadline, isApproved } = req.body;

    const newOpportunity = new Opportunity({
      title,
      description,
      companyId,
      type,
      location,
      deadline,
      isApproved
    });

    await newOpportunity.save();

    res.status(201).json({
      message: "Opportunity created successfully",
      opportunity: newOpportunity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all Opportunities
app.get("/opportunities", async (req, res) => {
  try {
    const opportunities = await Opportunity.find().populate("companyId", "name email");
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ single Opportunity
app.get("/opportunities/:id", async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate("companyId", "name email");
    if (!opportunity) return res.status(404).json({ error: "Opportunity not found" });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Opportunity
app.put("/opportunities/:id", async (req, res) => {
  try {
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOpportunity) return res.status(404).json({ error: "Opportunity not found" });
    res.json({
      message: "Opportunity updated successfully",
      opportunity: updatedOpportunity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Opportunity
app.delete("/opportunities/:id", async (req, res) => {
  try {
    const deletedOpportunity = await Opportunity.findByIdAndDelete(req.params.id);
    if (!deletedOpportunity) return res.status(404).json({ error: "Opportunity not found" });
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =================== APPLICATIONS CRUD ===================

// CREATE application
app.post("/applications", async (req, res) => {
  try {
    const { userId, opportunityId, appliedAt, status } = req.body;

    const newApplication = new Application({
      userId,
      opportunityId,
      appliedAt,
      status
    });
    await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all applications
app.get("/applications", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("opportunityId", "title type");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ single application
app.get("/applications/:id", async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("userId", "name email")
      .populate("opportunityId", "title type");
    if (!application) return res.status(404).json({ error: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE application (e.g., change status)
app.put("/applications/:id", async (req, res) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("userId", "name email")
      .populate("opportunityId", "title type");

    if (!updatedApplication) return res.status(404).json({ error: "Application not found" });
    res.json({
      message: "Application updated successfully",
      application: updatedApplication
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE application
app.delete("/applications/:id", async (req, res) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(req.params.id);
    if (!deletedApplication) return res.status(404).json({ error: "Application not found" });
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//end delete

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
