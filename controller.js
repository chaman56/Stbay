const User = require('./models/user.js');
const Product = require('./models/product.js');


exports.adduser = async(req,res)=>{
  if(!req.body){
    res.render('login', {message : "Can not send empty request!"});
    return;
  }
  const user = new User({
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    username : req.body.username,
    password : req.body.password,
  })
  await user.save().then(user => {
    res.redirect('login');
    /* const room = new Room({
      roomname : user.username,
      chats: [],
      members: [user.username],
      createdby: user.username,
      admin: user.username
    })
    room.save().then(()=>{
      res.redirect('login')
    }); */
  }).catch(err=>{
    res.render('login', {message : "User already exists!" ||  err.message || "Some error occured while creating!"} );
  })
}

exports.getin = async(req, res) => {
  const username = req.query.username;
  const password = req.query.password;
  try {
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
      res.render('login', { message: "Invalid login credentials!" });
      return;
    }
    /* const chatdata = await Room.findOne({roomname: "CommonRoom"});  //Remove it
    const allrooms = await Room.find();
    res.render('user', { user:user, roomdata: chatdata, allrooms: allrooms }); */
    const data = await Product.find();
    res.render('home', {data: data, user: user});
  } catch (err) {
    res.render('login',{ message: err || "Error retrieving data! Try again." });
  }
}