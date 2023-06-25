const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product.js');
const Rental = require('./models/rental.js');
const Request = require('./models/request.js');
const User = require('./models/user.js');
const Donation = require('./models/donation.js');
const controller = require('./controller.js');
const multer = require('multer');
const {storage} = require('./cloudinary.js');
const upload = multer({storage});
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.user,
    pass: process.env.pass
  }
});



dotenv.config({path: 'config.env'});
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static('public'));
app.set('view engine', 'ejs');

const connectDB = async ()=>{
  try{
    const con = await mongoose.connect(process.env.mongourl,{
      useNewUrlParser:true,
      useUnifiedTopology:true,
    })
    console.log(`mongodb connected :${con.connection.host}`)
  }catch(err){
    console.log(err);
  }
}
connectDB();

app.get('/', async (req, res) => {
  const data = await Product.find();
  res.render('stbay' , {data : data});
});
app.get('/home', async (req, res) => {
  const id = req.query.id;
  const user = await User.findById(id);
  const data = await Product.find();
  res.render('home' , {data : data,user : user});
});
app.get('/about',async (req, res) => {
  const id = req.query.id;
  res.render('about',{user :{id : id}});
})
app.get('/addproduct', async(req, res) => {
  const id = req.query.id;
  const user = await User.findById(id);
  res.render('postproduct',{user :user});
})
app.get('/rentproduct', async(req, res) => {
  const id = req.query.id;
  const user = await User.findById(id);
  res.render('rentproduct',{user: user});
})
app.get('/requestproduct', async(req, res) => {
  const id = req.query.id;
  const user = await User.findById(id);
  res.render('requestproduct',{user: user});
})
app.get('/donate', async(req, res) => {
  const id = req.query.id;
  const user = await User.findById(id);
  res.render('donate', {user: user});
})

app.get('/getproduct', async (req,res)=>{
  const id = req.query.id;
  const pid = req.query.pid;
  const user = await User.findById(id);
  const product = await Product.findById(pid);
  let owner = new User;
  if(product.owner){
    owner = await User.findById(product.owner);
  }
  res.render('getproduct', {user: user, product: product, owner: {id: owner.id, email: owner.email}});
})
app.get('/getrented', async (req, res) => {
  const id = req.query.id;
  const pid = req.query.pid;
  const user = await User.findById(id);
  const product = await Rental.findById(pid);
  let owner = new User;
  if(product.owner){
    owner = await User.findById(product.owner);
  }
  res.render('getproduct', {user: user, product: product, owner: {id: owner.id, email: owner.email}});
})

app.post('/postorder', async (req, res) =>{
  const id = req.query.id;
  const pid = req.query.pid;
  const user = await User.findById(id);
  const product = await Product.findById(pid);
  let owner = new User;
  if(product.owner){
    owner = await User.findById(product.owner);
    var mailOptions = {
      from: 'stbay56@gmail.com',
      to: owner.email,
      subject: user.username + ' Bought your product at Stbay',
      text: `
      Buyers email : ${user.email},
      Buyer's hostel name : ${req.body.hostel},
      Buyer's Room no :  ${req.body.room},
      Buyer's college :  ${req.body.college},

      Bought products Dtails are  : 
      product title : ${product.title}
      product description : ${product.description}`
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  res.render('success', {user: user});
})


app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/getin', controller.getin);
app.post('/adduser', controller.adduser);


app.post('/postproduct',upload.single('thumbnail'), async (req, res) => {
  if(!req.body){
    res.status(404).send("couldn't create product! Please try again!");
    return;
  }
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    qty:req.body.qty,
    owner: req.query.id,
    description: req.body.description,
    imageurl: req.file.path
  })
  const prdct = await product.save();
  
  res.redirect(`/home?id=${req.query.id}`);
})

app.post('/postrental',upload.single('thumbnail'), async (req, res) => {
  if(!req.body){
    res.status(404).send("couldn't create product! Please try again!");
    return;
  }
  const product = new Rental({
    title: req.body.title,
    price: req.body.price,
    rate: req.body.rate,
    owner: req.query.id,
    qty:req.body.qty,
    description: req.body.description,
    imageurl: req.file.path
  })
  const prdct = await product.save();
  console.log(prdct);
  res.redirect(`/torent?id=${req.query.id}`);
})

app.post('/postdonation', upload.single('thumbnail'), async (req, res) => {
  if(!req.body){
    res.status(404).send("couldn't create product! Please try again!");
    return;
  }
  const product = new Donation({
    title: req.body.title,
    qty: req.body.qty,
    description: req.body.description,
    imageurl: req.file.path
  })
  const prdct = await product.save();
  res.redirect(`/home?id=${req.query.id}`);
})

app.post('/postrequest', async (req, res) => {
  const id = req.query.id;
  if(!req.body){
    res.status(404).send("couldn't create product! Please try again!");
    return;
  }
  const request = new Request({
    name:req.body.name,
    title: req.body.title,
    category: req.body.category,
    description: req.body.description
  })
  const rqst = await request.save();
  res.redirect(`/requests?id=${id}`);
})

app.get('/torent', async (req,res)=>{
  const id = req.query.id;
  const user = await User.findById(id);
  const data = await Rental.find();
  res.render('rent', {data : data, user : user});
})
app.get('/tobuy', async (req,res)=>{
  const id = req.query.id;
  const user = await User.findById(id);
  const data = await Product.find();
  res.render('buy', {data : data,user: user});
})
app.get('/donations', async (req,res)=>{
  const id = req.query.id;
  const user = await User.findById(id);
  const data = await Donation.find();
  res.render('donations', {data : data,user: user});
})
app.get('/requests', async (req,res)=>{
  const id = req.query.id;
  const data = await Request.find();
  res.render('requests', {data : data, user: {id: id}});
})



let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is live at http://localhost:${PORT}`);
});
