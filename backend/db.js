// db.js
const mongoose = require('mongoose');
const db_name = 'quickchance_db';

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://quickuser:OMMgA27WizN5qm31@quickchancecluster.l1tpflv.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=QuickChanceCluster`);
    console.log("✅ MongoDB Connected...");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

// Export function
module.exports = connectDB;
