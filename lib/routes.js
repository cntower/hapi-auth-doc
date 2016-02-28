'use strict';

var Joi = require('joi');
var handlers = require('../lib/handlers.js');

var productModel = Joi.object({
    name: Joi.string().required().example('cup'),
    description: Joi.string().required().example('this cup is white'),
    price: Joi.number().required().example(5.55),
    barcode: Joi.string().required().example('123456789999'),
    category: Joi.string().required().example('dishes')
}).label('Product').description('json body for product');

var productsModel = Joi.object({
    items: Joi.array().items(productModel),
    count: Joi.number().required().example('1'),
    pageSize: Joi.number().required().example('10'),
    page: Joi.number().required().example('1'),
    pageCount: Joi.number().required().example('1')
}).label('Products');

var errorModel = Joi.object({
    code: Joi.number(),
    msg: Joi.string()
}).label('Error');


var productHTTPStatus = {
    '200': {
        'description': 'Success',
        'schema': productModel
    },
    '400': {
        'description': 'Bad Request',
        'schema': errorModel
    },
    '500': {
        'description': 'Internal Server Error',
        'schema': errorModel
    }
};


var productsHTTPStatus = {
    '200': {
        'description': 'Success',
        'schema': productsModel
    },
    '400': {
        'description': 'Bad Request'
    },
    '404': {
        'description': 'Product not found'
    },
    '401': {
        'description': 'Unauthorized'
    },
    '500': {
        'description': 'Internal Server Error'
    }
};

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
            /*plugins: {
                'hapi-swagger': {
                    responses: loginHTTPStatus,
                    payloadType: 'form'
                }
            },*/
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
            /*plugins: {
                'hapi-swagger': {
                    responses: goodsHTTPStatus
                }
            },*/
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
            /*plugins: {
                'hapi-swagger': {
                    responses: registerHTTPStatus,
                    payloadType: 'form'
                }
            },*/
            tags: ['api', 'auth']
        }
    },  {
        method: 'GET',
        path: '/product',
        config: {
            auth: 'session',
            handler: handlers.productList,
            description: 'List products',
            notes: ['List the products in database'],
            plugins: {
                'hapi-swagger': {
                    responses: productsHTTPStatus
                }
            },
            tags: ['api'],
            validate: {
                /*query: {
                    page: Joi.number()
                        .description('the page number'),
                    pagesize: Joi.number()
                        .description('the number of items to a page')
                }*/
            }

        }

    },  {
        method: 'POST',
        path: '/product',
        config: {
            auth: 'session',
            handler: handlers.productPOST,
            description: 'Add product',
            notes: ['Adds a product to the database'],
            plugins: {
                'hapi-swagger': {
                    responses: productHTTPStatus,
                    payloadType: 'form',
                    nickname: 'storeit'
                }
            },
            tags: ['api'],
            validate: {
                payload:{
                    name: Joi.string().required().description('name of product'),
                    description: Joi.string().required().description('description'),
                    price: Joi.number().required().description('current price'),
                    barcode: Joi.string().required().description('barcode'),
                    category: Joi.string().required().description('category of product')
                }
            }

        }

    }
];