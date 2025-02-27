const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SOCSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  establishedDate: { type: Date, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['SOC', 'Employee'], required: true },
  photo: { type: String },
  idCardNumber: { type: String },
  businessLicense: { type: String }
});

SOCSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

SOCSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('SOC', SOCSchema);
