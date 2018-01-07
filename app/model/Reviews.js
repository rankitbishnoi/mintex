var mongoose = require( 'mongoose' );

/* ********************************************
reviews SCHEMA
******************************************** */
var reviewsSchema = new mongoose.Schema({
     product        : { type: mongoose.Schema.Types.ObjectId, ref: 'Products'},
     comment        : { type: String, required: true},
     rating         : { type: Number,  min: 1, max: 5},
     postedBy       : { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model( 'Reviews', reviewsSchema );
