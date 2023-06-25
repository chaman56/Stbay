const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title : {
    type: String
  },
  description : {
    type : String
  },
  imageurl : {
    type : String
  },
  qty: {
    type : Number,
  },
  tags : {
    type : Array,
    default : []
  },
  date : {
    type : Date,
    default : Date.now()
  }
})

const Donation = mongoose.model('Donation', productSchema);
module.exports = Donation;