const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userID: { type: Number, unique: true },       // filled by plugin
  name:   { type: String, required: true, trim: true },
  email:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role:   { type: String, enum: ['youth','company','admin'], default: 'youth' },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Auto increment userID
userSchema.plugin(AutoIncrement, { inc_field: 'userID' });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
