let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let LocationSchema = new mongoose.Schema({
    name: String,
    coords: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'  
    }
})
let connection = mongoose.connection;
autoIncrement.initialize(connection);
LocationSchema.plugin(autoIncrement.plugin, 'Location');


let Location = mongoose.model('Location', LocationSchema);
module.exports = Location;
