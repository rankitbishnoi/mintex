var mongoose = require( 'mongoose' );

/* ********************************************
USER SCHEMA
******************************************** */
var userSchema = new mongoose.Schema({
     batch               : String,
     username            : {  type: String,  unique: true},
     email               : {  type: String,  unique:true},
     firstname           : String,
     lastname            : String,
     mobilenumber        : Number,
     password            : {  type: String,  min: '8'},
     address             : String,
     company             : String,
     gstin               : String,
     createdOn           : {  type: Date,    default: Date.now },
     lastLogin           : Date
});
// Build the User model
mongoose.model( 'User', userSchema );
