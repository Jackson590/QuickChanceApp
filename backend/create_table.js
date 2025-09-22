require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');

async function run() {
  await connectDB();

  try {
    // Create company user if not exists
    let company = await User.findOne({ role: 'company' });
    if (!company) {
      company = new User({
        name: 'Test Company',
        email: 'company@example.com',
        password: 'companypass',
        role: 'company'
      });
      await company.save();
      console.log('Company user created:', company.email);
    } else {
      console.log('Company user exists:', company.email);
    }

    // Create youth user if not exists
    let youth = await User.findOne({ role: 'youth' });
    if (!youth) {
      youth = new User({
        name: 'Test Youth',
        email: 'youth@example.com',
        password: 'youthpass',
        role: 'youth'
      });
      await youth.save();
      console.log('Youth user created:', youth.email);
    } else {
      console.log('Youth user exists:', youth.email);
    }

    // Create opportunity if not exists
    let opportunity = await Opportunity.findOne({ title: "Software Internship" });
    if (!opportunity) {
      opportunity = new Opportunity({
        title: "Software Internship",
        description: "Work with our dev team",
        companyId: company._id,
        type: "internship",
        location: "Kigali",
        deadline: new Date("2025-10-01T00:00:00Z"),
        isApproved: false,
        createdAt: new Date("2025-09-19T10:00:00Z")
      });
      await opportunity.save();
      console.log('Opportunity created:', opportunity.title);
    } else {
      console.log('Opportunity exists:', opportunity.title);
    }

    // Create application if not exists
    let application = await Application.findOne({ userId: youth._id, opportunityId: opportunity._id });
    if (!application) {
      application = new Application({
        userId: youth._id,
        opportunityId: opportunity._id,
        appliedAt: new Date("2025-09-19T10:05:00Z"),
        status: "pending"
      });
      await application.save();
      console.log('Application created for:', youth.email);
    } else {
      console.log('Application already exists for:', youth.email);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

run();