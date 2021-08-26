var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: String,
    host: String,
    category: [String],
    start_date: Date,
    end_date: Date,
    location: String,
  },
  { timestamps: true }
);

var Event = mongoose.model('Event', eventSchema);
module.exports = Event;
