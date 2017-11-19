const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

mongoose.connect(process.env.DB_URL); //connect to database

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'chingubears12' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//routes
require('./app/routes.js')(app, passport); // load routes and pass in app and fully configured passport
var users = require('./app/routes/users');
app.use('/users', users);
var jobs = require('./app/routes/jobs');
app.use('/jobs', jobs);
var company = require('./app/routes/company')
app.use('/company', company);
app.use("/stylesheets",  express.static(path.join(__dirname, 'app', 'public', 'stylesheets')));
//launch
app.listen(port);
console.log('The magic happens on port ' + port);