const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  summary: String,
  url: String,
  keywords: {
    positive_keywords: [String],
    negative_keywords: [String],
  },
  sentiments: {
    Positive: Number,
    Negative: Number,
    Nuetral: Number,
  },
  avgRating: Number, // Added average rating
});

module.exports = mongoose.model('History', HistorySchema);
