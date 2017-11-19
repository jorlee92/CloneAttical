const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
//schema to hold an applied job.
var appliedJobSchema = mongoose.Schema({
    applicationID: {
        type: String,
        required: true
    },
    applicationURL: {
        type: String, 
        required: true
    },
    companyName: {
        type: String,
        required: true
    }, 
    
})
var savedJobSchema = mongoose.Schema({
    jobID: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String, 
        required: true
    },
    
})
var submittedJobSchema = mongoose.Schema({
    id: String, 
    name: String
})
//schema for user model
var userSchema = mongoose.Schema({

    local:{
        email: String,
        password: String
    },
    facebook:{
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    appliedJobs: [appliedJobSchema],
    savedJobs:[savedJobSchema],
    RecruiterDetails: {
        companyID: String, 
        companyName: String, 
        postedJobs: [submittedJobSchema]
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
// method to add log applied jobs
userSchema.methods.addAppliedJob = function(applicationID, applicationURL, companyName, callback){
    this.appliedJobs.push({
        applicationID: applicationID,
        applicationURL: applicationURL,
        companyName: companyName})
    this.save(function (err, result){
        callback(err, result);
    });
}
// method to add saved jobs to a profile. 
userSchema.methods.addSavedJob = function(jobID, companyName, jobTitle, callback){
    this.savedJobs.push({
        jobID: jobID,
        jobTitle: jobTitle,
        companyName: companyName
    })
    this.save(function(err, result){
        callback(err, result);
    });
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);