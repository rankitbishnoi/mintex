const mongoose = require('mongoose');
const express = require('express');
const userRouter = express.Router();
const otplib = require('otplib');
var nodemailer = require('nodemailer');

const userModel = mongoose.model('User');
var auth = require("./../../middlewares/auth");
var responseGenerator = require('./../../libs/responseGenerator');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'rankitgodara1@gmail.com',
        pass: 'nopassword'
    }
});

module.exports.controller = (app) => {

     userRouter.get('/login/screen',(req, res) =>{

          res.render('login');

     });//end get login screen

     userRouter.get('/register/screen',(req, res) =>{

          res.render('register', {user_seller: req.query.as});

     });//end get signup screen

     userRouter.get('/logout',(req, res) =>{

          req.session.destroy((err) => {

               res.redirect('/mintex/login/screen');

          })

     });//end logout

     userRouter.post('/register/user', (req, res) => {
          if(req.body.username!=undefined && req.body.firstname!=undefined && req.body.lastname!=undefined && req.body.email!=undefined && req.body.password!=undefined){

               var newUser = new userModel({
                    batch                : 'User',
                    username            : req.body.username,
                    firstname           : req.body.firstname,
                    lastname            : req.body.lastname,
                    email               : req.body.email,
                    mobilenumber        : req.body.mobile,
                    password            : req.body.password,
                    createdOn           : Date.now()

               });// end new user
               newUser.save((err) =>{
                    if(err){

                         var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                         res.render('error', {
                              message: myResponse.message,
                              error: myResponse.data
                         });
                    }
                    else{
                         req.session.user = newUser;
                         delete req.session.user.password;
                         res.redirect('/mintex/dashboard')
                    }
               });//end new user save
          }
          else{
               var myResponse = {
                    error: true,
                    message: "Some body parameter is missing",
                    status: 403,
                    data: null
               };
               res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
               });
          }
     });


     userRouter.post('/register/seller', (req, res) => {
          if(req.body.username!=undefined && req.body.firstname!=undefined && req.body.lastname!=undefined && req.body.email!=undefined && req.body.password!=undefined){

               var newUser = new userModel({
                    batch               : 'Seller',
                    username            : req.body.username,
                    firstname           : req.body.firstname,
                    lastname            : req.body.lastname,
                    email               : req.body.email,
                    mobilenumber        : req.body.mobilenumber,
                    password            : req.body.password,
                    address             : req.body.address,
                    gstin               : req.body.gstin,
                    company             : req.body.company,
                    createdOn           : Date.now()

               });// end new seller
               newUser.save((err) =>{
                    if(err){

                         var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                         res.render('error', {
                              message: myResponse.message,
                              error: myResponse.data
                         });
                    }
                    else{
                         req.session.user = newUser;
                         delete req.session.user.password;
                         res.redirect('/mintex/dashboard/seller')
                    }
               });//end new seller save
          }
          else{
               var myResponse = {
                    error: true,
                    message: "Some body parameter is missing",
                    status: 403,
                    data: null
               };
               res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
               });
          }
     });

     userRouter.post('/login', (req, res) =>{

          userModel.findOne({$and:[{'email':req.body.id},{'password':req.body.password}]},function(err,foundUser){
               if(err){
                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }
               else if(foundUser==null || foundUser==undefined || foundUser.username==undefined){

                    var myResponse = responseGenerator.generate(true,"user not found. Check your email and password",404,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }
               else{
                    var query = {'email':req.body.email};
                    var options = { multi: false};
                    userModel.update(query, { $set: { lastLogin : Date.now() }}, options, callback);
                    var callback = (err) => {
                         if (err) {
                              var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                              res.render('error', {
                                   message: myResponse.message,
                                   error: myResponse.data
                              });
                         }
                    };

                    req.session.user = foundUser;
                    delete req.session.user.password;
                    if (req.session.user.batch === 'User') {
                         res.redirect('/mintex/dashboard');
                    }
                    else{
                         res.redirect('/mintex/dashboard/seller');
                    }
               }
          });
     });//end login screen

     userRouter.get('/forgotpassword', (req, res) => {
          res.render('forgotpassword');
     });

     userRouter.post('/recover', (req, res) => {

          const secret = otplib.authenticator.generateSecret();
          const token = otplib.authenticator.generate(secret);
          req.secret = secret;

          const mailOptions = {
               from: 'rankitgodara1@email.com', // sender address
               to: req.body.email, // list of receivers
               subject: 'OTP for password recovery', // Subject line
               html: '<p>OTP =' + token + '</p>'// plain text body
          };

          transporter.sendMail(mailOptions, function (err, info) {
               if(err)
               console.log(err)
               else
               console.log(info);
          });
     });

     userRouter.post('/updatepassword', (req, res) => {
          const isValid = otplib.authenticator.check(req.body.token, req.secret);

          if (isValid) {
               userModel.findOne({'email': req.body.email}, (err, user) => {
                    user.password = req.body.password;
                    user.save((err) =>{
                         if(err){

                              var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                              res.render('error', {
                                   message: myResponse.message,
                                   error: myResponse.data
                              });
                         }
                         else{
                              req.session.user = newUser;
                              delete req.session.user.password;
                              res.redirect('/mintex/dashboard')
                         }
                    });
               });
          }
          else {
               var myResponse = responseGenerator.generate(true,"Wrong otp. please try again",500,null);
               res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
               });
          }

     });


     app.use('/mintex', userRouter);
};
