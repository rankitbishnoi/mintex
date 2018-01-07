const mongoose = require('mongoose');
const express = require('express');
const userRouter = express.Router();

const reviewModel = mongoose.model('Reviews');
const productsModel = mongoose.model('Products');
var auth = require("./../../middlewares/auth");
var responseGenerator = require('./../../libs/responseGenerator');

module.exports.controller = (app) => {

     userRouter.get('/product', auth.checkLogin, (req, res) => {
          productsModel.find({"_id": req.query.productid}, (err, product) =>{
               if (err) {
                    var myResponse = responseGenerator.generate(true,"data not found"+err,404,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }else {

                    reviewModel.find({ product: req.query.productid}, (err,reviews) => {
                         if (err) {
                              var myResponse = responseGenerator.generate(true,"data not found"+err,404,null);
                              res.render('error', {
                                   message: myResponse.message,
                                   error: myResponse.data
                              });
                         }
                         else {
                              res.render('product', { product: product[0], reviews: reviews, user: req.session.user.username});
                         }
                    })
               }
          });
     });

     userRouter.get('/seller/newproduct/screen', auth.checkLogin, auth.verifySeller, (req, res) =>{

          res.render('newproduct', {user: req.session.user.username});

     });//end get newproduct screen

     userRouter.get('/seller/updateproduct/screen', auth.checkLogin, auth.verifySeller, (req, res) =>{
          productsModel.find({ 'sellerid': req.session.user.id}, (err, products) =>{
               if (err) {
                    var myResponse = responseGenerator.generate(true,"data not found"+err,404,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }else {
                    res.render('updateproduct', { list: products, user: req.session.user.username });
               }
          })

     });//end get updateproduct screen

     userRouter.post('/seller/updateproduct/find', auth.checkLogin, auth.verifySeller, (req, res) =>{
          productsModel.find({$and:[{'sellerid': req.session.user.id},{'name':req.body.name}]}, (err, products) =>{
               if (err) {
                    var myResponse = responseGenerator.generate(true,"data not found"+err,404,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }else { console.log(products);
                    res.render('updateproduct', { list: products, user: req.session.user.username });
               }
          })

     });//end get updateproduct screen



     userRouter.post('/seller/newproduct', auth.checkLogin, auth.verifySeller, (req, res) =>{

          var tags = () =>{
               if (req.body.keywords == undefined || req.body.keywords == null) {
                    return null;
               }else {
                    return req.body.keywords.split(",");
               }
          }

          var newProduct = new productsModel({
               name: req.body.name,
               description: req.body.description,
               sellersid: req.session.user.id,
               price: req.body.price,
               brand: req.body.brand,
               catagory: req.body.catagory,
               color: req.body.color || null,
               size: req.body.size || null,
               gendertype: req.body.gendertype || null,
               stock: req.body.stock,
               Keywords: tags()
          });

          newProduct.save(function(err, product){
               if(err){

                    var myResponse = responseGenerator.generate(true,"Couldn't Add the product. Please try again."+err,500,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });

               }
               else{
                    res.redirect('/mintex/dashboard/seller');
               }

          });
     });

     userRouter.get('/seller/updateproductbyid', auth.checkLogin, auth.verifySeller, (req, res) =>{
          productsModel.find({"_id": req.query.productid}, (err, product) => {
               if (err) {
                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }
               else {
                    res.render('updateproductbyid', {product: product[0], user: req.session.user.username});
               }
          });
     });

     userRouter.post('/seller/updateproduct', auth.checkLogin, auth.verifySeller, (req, res) =>{

          var tags = () =>{
               if (req.body.tags == undefined || req.body.tags == null) {
                    return null;
               }else {
                    return req.body.tags.split(",");
               }
          };

          productsModel.findOne({"_id": req.query.productid}, (err, product) => {
               if (err) {
                    var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }
               else {
                    product.name = req.body.name;
                    product.description = req.body.description;
                    product.sellersid = req.session.user.id;
                    product.price = req.body.price;
                    product.brand = req.body.brand;
                    product.catagory = req.body.catagory;
                    product.color = req.body.color || null;
                    product.size = req.body.size || null;
                    product.gendertype = req.body.gendertype || null;
                    product.stock = req.body.stock;
                    product.Keywords = tags();

                    product.save(function(err, product){
                         if(err){

                              var myResponse = responseGenerator.generate(true,"Couldn't Add the product. Please try again."+err,500,null);
                              res.render('error', {
                                   message: myResponse.message,
                                   error: myResponse.data
                              });

                         }
                         else{
                              res.redirect('/mintex/dashboard/seller');
                         }

                    });
               }
          });
     });

     userRouter.post('/reviews/create', (req, res) => {
          if(req.body.username!=undefined && req.body.firstname!=undefined && req.body.lastname!=undefined && req.body.email!=undefined && req.body.password!=undefined){

               var newReview = new reviewModel({
                    product        : req.query.productid,
                    rating         : req.body.rating,
                    comment        : req.body.comment,
                    postedBy       : req.session.user.id

               });// end new seller
               newReview.save((err) =>{
                    if(err){

                         var myResponse = responseGenerator.generate(true,"Sorry for inconvinience. Couldn't complete the action. Please try After some time."+err,500,null);
                         res.render('error', {
                              message: myResponse.message,
                              error: myResponse.data
                         });
                    }
                    else{

                         res.redirect('mintex/product?id=' + req.query.productid);
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

     userRouter.get('/addtocart', (req, res) => {
          var productobj = {
               id: req.query.productid,
               name: req.query.name,
               price: req.query.price
          }
          req.session.user.cart.push(productobj);

          res.redirect('/mintex/product?productid='+ req.query.productid);
     });

     userRouter.get('/removefromcart', (req, res) => {
          var i = req.query.i - 1;
          req.session.user.cart.splice(i,1);
          res.redirect('/mintex/cart');
     })

     userRouter.get('/cart', (req, res)=> {
          res.render('cart', {products: req.session.user.cart});console.log(req.session.user);
     });

     userRouter.post('/seller/deleteproduct', auth.checkLogin, auth.verifySeller, (req, res) => {
          productsModel.findOneAndRemove({'_id': req.query.productid}, function(err){
               if (err) {
                    var myResponse = {
                         error: true,
                         message: "Can not perform this action. please try again",
                         status: 400,
                         data: null
                    };
                    res.render('error', {
                         message: myResponse.message,
                         error: myResponse.data
                    });
               }
               res.redirect('/mintex/dashboard/seller');
          });
     })

     app.use('/mintex', userRouter);

}
