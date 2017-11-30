let express = require('express');
let router = express.Router();
let Job = require('../models/job.js');
let User = require('../models/user.js');
router.get('/view/:id', function(req, res){
    let jobID = req.params.id;
    Job.findById(jobID, function(err, result){
        if(err || !result){
            //TODO: ERROR PAGE?
            res.send("Could not find that job!")
        }
        else{
            res.render("../views/single_job.ejs", { job: result  });
        }
    })
})
router.get('/view/:id/save', function(req, res){
    let jobID = req.params.id;
    //Only continue if the user is logged in
    if(req.isAuthenticated()){
        //Find the job
        Job.findById(jobID, function(err, result){
            if(err || !result){
                res.send("Could not find a job with the provided ID!");
            }
            else{
                let job_id = jobID;
                let job_company = result.company["name"];
                let job_title = result.jobTitle;
                //If the job exists take the data from it and add it as a saved job. 
                User.findOne({
                    "_id" : req.user["_id"]
                }, function(error, user){
                    if(error, !user){
                        res.send("Could not find profile")
                    }
                    else{
                        user.addSavedJob(job_id, job_company, job_title, function(err, result){
                            if(err || !result){
                                res.send("An error has occured, please contact support");
                            }
                            else{
                                res.redirect("/profile/");
                            }
                        });
                    }
                })
            }
        })
    }
    else{
        //TODO: ERROR PAGE
        res.send("You must be logged in to save jobs")
    }
})
router.get('/new', function(req, res){
    if (req.isAuthenticated()){
        res.render('../views/new_job.ejs');
    }
    else{
        res.redirect('/jobs/');
    }
})
router.post('/new', function(req, res){
        if(req.isAuthenticated()){
        let jobTitle = req.body["job-title"];
        let jobCompany = req.body["job-company"];
        let jobLocation = req.body["job-location"];
        let jobLocationLat = req.body["job-lat"];
        let jobLocationLong = req.body["job-long"];
        let jobApplicationURL = req.body["job-url"];
        let jobType = req.body["job-type"];
        let jobDesc = req.body["job-desc"];
        let createdBy = req.user["_id"];
        let companyID = req.user.RecruiterDetails.companyID;
        Job.addJob(createdBy,jobCompany, jobLocation, jobLocationLat, jobLocationLong, new Date(2022,1,20), jobTitle, jobType, jobApplicationURL, companyID, jobDesc, function(err, newjob){
            if(err || !newjob){
                res.send("Failed to create job");
            }
            else{
                User.findOne({
                    "_id" : req.user["_id"]
                }, function(error, user){
                    if(error || !user){
                        console.log("Issue while trying to add the job to the user's applied created jobs")
                    }
                    else if (user){
                        user.RecruiterDetails.postedJobs.push({
                            id: newjob["_id"],
                            name: newjob["jobTitle"]
                        });
                        user.save();

                    }
                })
                res.send("Created Job");
            }
        })
    }
    else{
        res.send("You must be logged in to create a job!");

        }
    })

router.get('/', function(req, res){
    Job.find({}, function(err, results){
        if(err || !results){
            res.send("Could not find any Jobs");
        }
        else{
            res.render("../views/jobs_list.ejs", {jobs: results});
        }
    })
})
router.get('/find/category/:category', function(req, res){
    let categoryName = req.params.category;
    Job.find({
        jobType: categoryName
    }, function(error, results) {
        if(error || !results){
            res.render("../views/jobs_list.ejs", {error: "Could not find any matching jobs!", jobs: {}});
        }
        else{
            res.render("../views/jobs_list.ejs", { jobs: results });
        }
    })
})
router.get('/find/near/:long/:lat', function(req, res){
    let searchLong = req.params.long;
    let searchLat = req.params.lat;
    Job.findNear(searchLong, searchLat, 0, 500, function(error, results){
        if (error || !results){
            res.send("No nearby jobs found")
        }
        else {
            res.render("../views/jobs_list.ejs", { jobs: results});
        }
    })
}) 






module.exports = router;
