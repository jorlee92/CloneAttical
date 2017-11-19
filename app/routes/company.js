var express = require('express');
var router = express.Router();
var Company = require('../models/company.js');
var User = require('../models/user.js');
var Job = require('../models/job.js');
/* GET company listing. */
router.get('/', function(req, res, next) {
	//TODO: Only redirect to the create a new company page if the user is either not logged in
	//or does not have a company associated with them. 
	if (req.isAuthenticated() && !req.user.RecruiterDetails.companyID){
        res.redirect('/company/new');
	}
	else if (req.isAuthenticated() && req.user.RecruiterDetails.companyID){
		let companyID = req.user.RecruiterDetails.companyID;
		Job.find({"company._id": companyID }, function(err, results){
			console.log(companyID);
			console.log(results);
			res.send(results);
			}
		);
			
		}
	else{
		res.redirect('/profile');
	}
});
router.get('/new', function(req, res){
	res.render('../views/new_company.ejs');
})
router.post('/new', function(req, res){
	//TODO: Make Sure the user is logged in. 
	let companyName = req.body["company-name"]
	let companyIndusry = req.body["company-industry"];
	let companyLocation = req.body["company-location"];
	let CompanyData = {
		name: companyName,
		location: companyLocation,
		industry: companyIndusry
	}
	Company.create(CompanyData, function(err, result){
		if(err || !result){
			res.send("There was an issue adding your company, please try again or contact support!")
		}
		else{
			User.findOne({
                "_id" : req.user._id
            }, function(error, user){
                if(error || !user){
                    res.send("Something went wrong, please try again");
                }
                else if (user){
					user.RecruiterDetails = {
						companyID: result._id,
						companyName: result.name
					}
					user.save();

                }
            })
			res.send("Created new company " + result.name + "!");
		}
	})

})

module.exports = router;
