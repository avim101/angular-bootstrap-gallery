'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImagesSchema = new Schema({
  title: String,
  url: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Images', ImagesSchema);
