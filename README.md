# Stbay
This is an ecommerce site for campus students to buy, sell, rent, donate and request products.
  
#frontend  
  I have used ejs templates for the front end. All of which are in views folder.  
  -partials folder inside views contains the files like navbar, sidebar, header, footer etc.  
  -The landing page is with the name stbay.ejs  
  -The Home page is with the name home.ejs  
  -Buy, rent, donations and request.ejs files are to show the buying renting , donating and requst pages and products.
  -postproduct, rentproduct, requestproduct, donate.ejs files are simple forms to do corresponding things.
  -addproduct.ejs is the page where you will land when you buy something.
#backend
  -all the backend codes are in the files server.js, controller.js and cloudinary.js
  -devloped in nodejs using express.
  -mongodb is used as database.
  -images are stored at cloudinary using multer.
  -node mailer is used to send emails.
  -dotenv file (excluded) contains the mongodb atlas url, cloudinary api variable, and nodemailer api variables.
