var Mongoose = require('../lib/database').Mongoose;

//create the schema
var userSchema = new Mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

userSchema.plugin(require('passport-local-mongoose'), {
    usernameField: 'email',
    hashField: 'password',
    usernameLowerCase: true
});

//create the model and add it to the exports
module.exports = Mongoose.model('User', userSchema, 'Users');