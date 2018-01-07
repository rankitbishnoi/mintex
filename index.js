const express = require("express");
const app = express();

var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var path = require ('path');

app.use(logger('dev'));
app.use(cookieParser());

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// initialization of session middleware

app.use(session({
     name :'myCustomCookie',
     secret: 'myAppSecret', // encryption key
     resave: true,
     httpOnly : true,
     saveUninitialized: true,
     cookie: { secure: false }
}));

// set the templating engine
app.set('view engine', 'jade');

//set the views folder
app.set('views',path.join(__dirname + '/app/views'));


mongoose.connect("mongodb://localhost/myapp",{
     useMongoClient: true,
});

mongoose.connection.on('connected', () => {
     console.log('Mongoose connected to mongodb://localhost/myapp');
});

mongoose.connection.on('error',(err) => {
     console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
     console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
     mongoose.connection.close(() => {
          console.log('Mongoose disconnected through app termination');
          process.exit(0);
     });
});


const fs = require('fs');

fs.readdirSync('./app/model').forEach( (file) => {
     if (file.indexOf('.js')) {
          require('./app/model/'+file);
     }
});

fs.readdirSync('./app/controller').forEach( (file) => {
     if (file.indexOf('.js')) {
          const route = require('./app/controller/'+file);
          route.controller(app);
     }
});


app.listen(3000, () => {
     console.log("listening on port 3000");
});
