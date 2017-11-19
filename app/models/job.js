let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let LocationSchema = require('./location.js');
let CompanySchema = require('./company.js');
const NUMBER_OF_MILES_IN_DEGREE = 68.703;
let JobSchema = new mongoose.Schema({
    creatorID:{
        type: String, 
        required: true,
    },
    company: CompanySchema.schema,
    closeDate:{
        type: Date, 
        required: false,
    }, 
    jobTitle:{
        type: String, 
        required: true,
    },
    jobType: {
        type: String, 
        required: true
    }, 
    location: LocationSchema.schema, 
    applicationURL: {
        type: String,
        required: false
    },
    jobDescription: {
        type: String, 
        required: true
    }
});
var connection = mongoose.connection;
autoIncrement.initialize(connection);
JobSchema.plugin(autoIncrement.plugin, 'Job');

JobSchema.statics.addJob = function(creatorID, companyName,
    locationName, locationLat, locationLong, 
    closeDate, jobTitle, jobType, jobURL, companyID, jobDescription, callback){
    
    var jobObject = {
        creatorID: creatorID, 
        company: {name: companyName, _id: companyID},
        location:{
            name: locationName,
            coords: [locationLat, locationLong]
        }, 
        closeDate: new Date(closeDate),
        jobTitle: jobTitle,
        jobType: jobType, 
        applicationURL: jobURL,
        jobDescription: jobDescription
    }
    this.create(jobObject, function(err, response){
        if(err || !response){
            console.log(err)
            callback(err, null)
        }
        else{
            console.log(response);
            callback(null, response);
        }
    })
}
JobSchema.statics.findNear = function(long, lat, minDistanceInMiles, maxDistanceInMiles, callback){
    Job.find({ 
        "location.coords" : 
        { 
            '$near': [ long, lat ], 
            '$maxDistance': (maxDistanceInMiles  / NUMBER_OF_MILES_IN_DEGREE),
            '$minDistance': (minDistanceInMiles / NUMBER_OF_MILES_IN_DEGREE)
        }
     }, 
    function(err, results){
        callback(err, results);
    })
}

JobSchema.statics.findNear2 = function(long, lat, minDistanceInMiles, maxDistanceInMiles, callback){

    this.find({
        "location.coords": {
          }
    }, function(err, results){
        console.log(err);
        console.log("Results: " + results);
    })
}
let Job = mongoose.model('Job', JobSchema);
module.exports = Job;
