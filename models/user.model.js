const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  campus: {
    type: String,
    enum: ['Madrid', 'Barcelona', 'Miami', 'Paris', 'Berlin', 'Amsterdam', 'Mexico', 'Sao_Paulo', 'Lisbon']
  }
  ,
  course: {
    type: String,
    enum: ['Web_Dev', 'UX/UI', 'Data_Analytics'],
  },
  image: String || "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
},
  { timestamps: true }
)

const User = mongoose.model('User', userSchema);
module.exports = User;