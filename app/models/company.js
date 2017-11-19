let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let CompanySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    location: String, 
    industry: String

})
autoIncrement.initialize(mongoose.connection);
CompanySchema.plugin(autoIncrement.plugin, 'Company');
let Company = mongoose.model('Company', CompanySchema);
module.exports = Company;