const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const opportunitySchema = new mongoose.Schema({
  opportunityID: { type: Number, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // refer to users._id
  type: { type: String, enum: ['job','internship','training','scholarship'], default: 'job' },
  location: { type: String, default: '' },
  deadline: { type: Date },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

opportunitySchema.plugin(AutoIncrement, { inc_field: 'opportunityID' });

module.exports = mongoose.model('Opportunity', opportunitySchema);
