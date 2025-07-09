const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  title: String,
  desc: String,
  filesize: String,
  fileURL: String, // Optional for downloadable file link
  tag: {
    isOpen: Boolean,
    textTitle: String,
    tagColor: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);
