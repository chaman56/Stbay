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
  owner : {
    type : String,
  },
  date : {
    type : Date,
    default : Date.now()
  }
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;