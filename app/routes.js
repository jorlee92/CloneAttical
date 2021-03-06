// app/routes.js
var User = require("./models/user.js");
var Job = require("./models/job.js");
module.exports = function(app, passport) {
    
        
        // HOME PAGE maybe??
        app.get('/', function(req, res) {
            Job.find({}, function(err, results){
                if(err || !results){
                    res.render('index.ejs', {});
                }
                else{
                    res.render('index.ejs', {jobs: results});
                }
            });
            // res.render('index.ejs', listOfJobs); // load the index.ejs file
        });
    
        
        // LOGIN
        // show the login form
        app.get('/login', function(req, res) {
            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { message: req.flash('loginMessage') }); 
        });
    
        // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
        
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });
    
        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile',
            failureRedirect : '/signup',
            failureFlash : true
        }));
    
        
        // PROFILE SECTION
        //want this protected so you have to be logged in to visit
        //use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        });
    
        
        // LOGOUT 
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
        app.get('/testAddAppliedJob', function(req, res){
            User.findOne({
                "_id" : req.user._id
            }, function(err, results){
                if(err || !results){
                    res.send("Something went wrong, please try again");
                }
                else if (results){
                    results.addAppliedJob("Test", "Test", "Test")
                    res.send(results);
                }
            })
        })

    };
        


    // route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
        // if they aren't redirect them to the home page
        res.redirect('/');
    }