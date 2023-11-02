//avatarModel.js
const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
  name: String,
  link: String,
});

const avatar = mongoose.model('avatar', avatarSchema);

module.exports = avatar;
