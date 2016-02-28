var Mongoose = require('../lib/database').Mongoose;

//create the schema product
//Товар должен содержать название, описание, цену, баркод, категорию
var productSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        get: getPrice,
        set: setPrice
    },
    barcode: {
        type: String,
        required: true
    },
    //TO DO references a category _id with type ObjectId
    category: {
        type: String,
        required: true
    },
});

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}

// validation
//if ( req.body.price ) {
//    req.assert('price', 'Enter a price (numbers only)').regex(/^\d+(\.\d{2})?$/);
//}

//create the model and add it to the exports
module.exports = Mongoose.model('Product', productSchema, 'Products');