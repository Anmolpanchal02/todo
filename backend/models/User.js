const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true, trim: true }, // Made required for consistency with authRoutes
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);