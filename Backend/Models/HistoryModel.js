// const mongoose = require('mongoose');

// const HistorySchema = new mongoose.Schema({
//   summary: String,
//   url: String,
//   keywords: {
//     positive_keywords: [String],
//     negative_keywords: [String],
//   },
//   sentiments: {
//     Positive: Number,
//     Negative: Number,
//     Nuetral: Number,
//   },
//   avgRating: Number, // Added average rating
//   createdAt:{
//     type:Date,
//     default:Date.now(),
//     expires:30 * 86400
// }
// });

// module.exports = mongoose.model('History', HistorySchema);


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
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 30 * 86400, // Expire after 30 days
  },
});

HistorySchema.pre('remove', async function (next) {
  const historyId = this._id;
  
  // Remove references to this history from User's reviews array
  await mongoose.model('User').updateMany(
    { reviews: historyId },
    { $pull: { reviews: historyId } }
  );
  
  next();
});

module.exports = mongoose.model('History', HistorySchema);
