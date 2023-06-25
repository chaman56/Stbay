const mongoose = require('mongoose');

const requestScema = mongoose.Schema({
  name: {
    type: String
  },
  title : {
    type: String
  },
  description : {
    type : String
  },
  category:{
    type: String
  },
  date : {
    type : Date,
    default : Date.now()
  }
})

const Request = mongoose.model('Request', requestScema);
module.exports = Request;