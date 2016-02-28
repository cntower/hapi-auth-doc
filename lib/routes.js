'use strict';

var Joi = require('joi');
var handlers = require('../lib/handlers.js');

var registerHTTPStatus = {
    '200': {
        'description': 'Success'
    },
    '400': {
        'description': 'Bad Request'
    },
    '500': {
        'description': 'Internal Server Error'
    }
};

var goodsHTTPStatus = {
    '200': {
        'description': 'Success'
        //, 'schema': goodsModel
    },
    '400': {
        'description': 'Bad Request'
    },
    '401': {
        'description': 'Missing authentication'
    },
    '500': {
        'description': 'Internal Server Error'
    }
};
var loginHTTPStatus = {
    '200': {
        'description': 'Success, redirect to /auth'
    },
    '400': {
        'description': 'Bad Request'
    },
    '500': {
        'description': 'Internal Server Error'
    }
};

module.exports = [
    {
    method: 'GET',
    path: '/',
    config: {
        auth: {
            mode: 'try',
            strategy: 'session'
        },
        handler: handlers.index
    }
    },
    {
        method: 'GET',
        path: '/login',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            handler: handlers.login
        }
    },
    {
        method: 'GET',
        path: '/register',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            handler: handlers.register
        }
    },
    {
        method: 'POST',
        path: '/login',
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            },
            description: 'login',
            notes: ['login'],
            handler: handlers.postLogin,
            plugins: {
                'hapi-swagger': {
                    responses: loginHTTPStatus,
                    payloadType: 'form'
                }
            },
            tags: ['api', 'auth']
        }
    },
    {
        method: 'GET',
        path: '/logout',

        config: {
            description: 'logout from site',
            notes: ['clear a cookie'],
            auth: 'session',
            handler: handlers.logout,
            plugins: {
                'hapi-swagger': {
                    responses: goodsHTTPStatus
                }
            },
            tags: ['api', 'auth'],
        }
    },
    {
        method: 'POST',
        path: '/register',
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            },
            handler: handlers.postRegister,
            description: 'New user registration',
            notes: ['Adds a new user to the database'],
            plugins: {
                'hapi-swagger': {
                    responses: registerHTTPStatus,
                    payloadType: 'form'
                }
            },
            tags: ['api', 'auth']
        }
    },
    {
        method: 'GET',
        path: '/auth',
        config: {
            auth: 'session',
            handler: handlers.secret,
            description: 'Page for work with goods',
            notes: ['just not working yet...'],
            plugins: {
                'hapi-swagger': {
                    responses: goodsHTTPStatus
                }
            },
            tags: ['api'],

        }
    },
];