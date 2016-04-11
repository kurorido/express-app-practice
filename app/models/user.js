var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  facebook: String,
  profile: {
    name: { type: String, default: '' }
  }
}, { timestamps: true });

mongoose.model('User', UserSchema);