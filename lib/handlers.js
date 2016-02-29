'use strict';

var User = require('../lib/user');
var Product = require('../lib/product');

/**
 * GET
 * Handles a call to / and shows some text with links to login and registration
 */
exports.index = function (request, reply) {

    if (request.auth.isAuthenticated) {
        // The user is already logged in, redirect
        //return reply.redirect('/product')
    }

    return reply.view('index');
}

/**
 * GET
 * Handles a call to /login and shows a login form
 */
exports.login = function (request, reply) {
    var creds = request.auth.credentials;
    console.log(creds);

    if (request.auth.isAuthenticated) {
        // The user is already logged in, redirect it to the hideout
        return reply.redirect('/product');
    }

    return reply.view('login');
}


/**
 * GET
 * Handles a call to /register and shows a registration form
 */
exports.register = function (request, reply) {

    if (request.auth.isAuthenticated) {
        // The user is already logged in, redirect it to the hideout
        return reply.redirect('/product');
    }

    return reply.view('register');
}

/**
 * Responds to POST /login and logs the user in, well, soon.
 */
exports.postLogin = function (request, reply) {
    var creds = request.auth.credentials;
    // In the version with Travelogue and Mongoose this was all handled by Passport (hence we retrieved
    // Passport and inserted the request and reply variables).
    User.authenticate()(request.payload.email, request.payload.password, function (err, user, passwordError) {

        // There has been an error, do something with it. I just print it to console for demo purposes.
        if (err) {
            return console.error(err);
        }

        // Something went wrong with the login process, could be any of:
        if (passwordError) {
            // For now, just show the error and login form
            console.log(passwordError);
            return reply({
                errorMessage: passwordError.message,
            });
        }

        // If the authentication failed user will be false. If it's not false, we store the user
        if (user) {
            var creds = request.auth.credentials;
            request.cookieAuth.set(user);
            return reply({
                statusCode: 200,
                message: 'User Login Successfully'
            });
        }

    });
};

/**
 * GET
 * Responds to GET /logout and logs out the user
 */
exports.logout = function (request, reply) {
    request.cookieAuth.clear();
    reply({
        statusCode: 201,
        message: 'Logout Successfully'
    });
};

/**
 * Responds to POST /register and creates a new user.
 */
exports.postRegister = function (request, reply) {

    // Create a new user, this is the place where you add firstName, lastName etc.
    // Just don't forget to add them to the validator above.
    var newUser = new User({
        email: request.payload.email
    });

    // The register function has been added by passport-local-mongoose and takes as first parameter
    // the user object, as second the password it has to hash and finally a callback with user info.
    User.register(newUser, request.payload.password, function (error, user) {

        if (error) {
            reply({
                statusCode: 503,
                message: error
            });
        } else {
            reply({
                statusCode: 201,
                message: 'User Saved Successfully'
            });
        }
    });

};
/**
 * Handles a call to /goods
 */
exports.productList = function (request, reply) {
    //Fetch all data from mongodb User Collection
    Product.find({}, function (error, data) {
        if (error) {
            reply({
                statusCode: 503,
                message: 'Failed to get data',
                data: error
            });
        } else {
            reply({
                statusCode: 200,
                message: 'Product Data Successfully Fetched',
                data: data
            });
        }
    });
    /*return reply.view('goods', {
     email: request.auth.credentials.email
     });*/
};
exports.productPOST = function (request, reply) {
    // Create mongodb product object to save it into database
    var product = new Product(request.payload);

    //Call save methods to save data into database and pass callback methods to handle error
    product.save(function (error) {
        if (error) {
            reply({
                statusCode: 503,
                message: error
            });
        } else {
            reply({
                statusCode: 201,
                message: 'Product Saved Successfully'
            });
        }
    });
};