const mongoose = require('mongoose');
const express = require('express');
const userRouter = express.Router();

const userModel = mongoose.model('User');
const productsModel = mongoose.model('Products');
var auth = require("./../../middlewares/auth");
var responseGenerator = require('./../../libs/responseGenerator');


module.exports.controller = (app) => {

     userRouter.get('/dashboard', auth.checkLogin, (req, res) =>{
          productsModel.find({}, (err, products) =>{
               if (err) {
                    var myResponse = responseGenerator.generate(true,"data not found"+err,404,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }else {
                    res.render('dashboard', {list: products, user: req.session.user.username});
               }
          });
     });

     userRouter.get('/dashboard/find', auth.checkLogin, (req, res) => {
          productsModel.find({'name' : req.body.name}, (err, products) =>{
               if (err) {
                    var myResponse = responseGenerator.generate(true,"data not found"+err,404,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }else {
                    res.render('dashboard', {list: products, user: req.session.user.username});
               }
          });
     });

     userRouter.get('/dashboard/seller', auth.checkLogin, auth.verifySeller, (req, res) => {
          productsModel.find({ 'sellerid': req.session.user.id}, (err, products) =>{
               if (err) {
                    var myResponse = responseGenerator.generate(true,"data not found"+err,404,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }else {
                    res.render('dashboardSeller', {
                         list: products,
                         seller: req.session.user.username
                    });
               }
          });
     });

     app.use('/mintex', userRouter);
};
