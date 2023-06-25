const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  title : {
    type: String
  },
  description : {
    type : String
  },
  price : {
    type : Number
  },
  rate: {
    type : String
  },
  imageurl : {
    type : String
  },
  owner : {
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

const Rental = mongoose.model('Rental', productSchema);
module.exports = Rental;