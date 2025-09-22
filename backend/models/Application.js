const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const applicationSchema = new mongoose.Schema({
  applicationID: { type: Number, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  coverLetter: { type: String, default: '' }
}, { timestamps: true });

// prevent same user applying twice to same opportunity
applicationSchema.index({ user: 1, opportunity: 1 }, { unique: true });

applicationSchema.plugin(AutoIncrement, { inc_field: 'applicationID' });

module.exports = mongoose.model('Application', applicationSchema);
