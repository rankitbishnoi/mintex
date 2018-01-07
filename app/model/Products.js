var mongoose = require( 'mongoose' );

/* ********************************************
products SCHEMA
******************************************** */
var productSchema = new mongoose.Schema({
    name            : String,
    description     : String,
    price           : Number,
    sellerid        : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    brand           : String,
    catagory        : String,
    color           : String,
    size            : String,
    gendertype      : String,
    stock           : Number,
    Keywords        : [String]
});
// Build the products model
mongoose.model( 'Products', productSchema );
