'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConvertSchema = new Schema({
  original: String,
  encoded: String,
  active: Boolean
});

module.exports = mongoose.model('Convert', ConvertSchema);