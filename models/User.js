const mongoose = require('mongoose');
const UniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    email : {type : String, require : true, unique : true},
    password : {type : String, require : true}
});

UserSchema.plugin(UniqueValidator);

module.exports = mongoose.model('User', UserSchema);