'use strict';

const Bcrypt    = require('bcrypt');
const Hapi      = require('hapi');
const Inert     = require('inert');
const HapiSwagger = require('hapi-swagger');
const Pack      = require('./package');
const Routes    = require('./lib/routes.js');
const pg        = require("pg");
var Config = require('./config');
var cookie      = require('hapi-auth-cookie');
const server = new Hapi.Server();

server.connection({
    host: Config.server.hostname,
    port: Config.server.port
});

const users = {
    niktest: {
        username: 'niktest',
        password: '$2a$08$FF2iKBKEJyjQ5kQV1qkvquWn1K2lbwFWByEblFepeZ9Cq.9nITlfq', //'qwerty'
        name: '',
        id: '1'
    }
};
const validate = function (request, username, password, callback) {
    const user = users[username];
    if (!user) {
        return callback(null, false);
    }
    Bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, { id: user.id, name: user.name });
});
};


const options = {
    info: {
        'title': 'Test API Documentation',
        'version': Pack.version,
    },
    auth: 'simple'
};

server.register([cookie, require('vision')], function (err) {

    if (err) {
        throw err;
    }

    // Set our strategy
    server.auth.strategy('session', 'cookie', {
        password: 'password-should-bea32-characters', // cookie secret
        cookie: 'session', // Cookie name
        //redirectTo: '/login',
        isSecure: false, // required for non-https applications
        ttl: 24* 60 * 60 * 1000 // Set session to 1 day
    });

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: __dirname + '/views'
    });

    server.route(Routes);//?

});


server.register(require('hapi-auth-basic'),function(err){
    if (err) {
        throw err;
    }
    server.auth.strategy('simple', 'basic', {
        validateFunc: validate
    })
});

server.register([
    Inert,
    {
        register: HapiSwagger,
        options: options
    }],
    (err) => {
    server.start( (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Server running at:', server.info.uri);
    }
    });
});