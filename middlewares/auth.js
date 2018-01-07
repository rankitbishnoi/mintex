//auth.checkLogin, auth.seller(create req.sellerid)
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
var responseGenerator = require('./../libs/responseGenerator');

exports.checkLogin = function(req,res,next){

	if(!req.user && !req.session.user){
		res.redirect('/mintex/login/screen');
	}
	else{

		next();
	}

}// end checkLogin

exports.verifySeller = (req, res, next) => {
	if (req.session.user.batch === 'Seller') {
		next();
	}
	else{
		var myResponse = responseGenerator.generate(true,"You are not authorised to visit this page",500,null);
		res.render('error', {
			message: myResponse.message,
			error: myResponse.data
		});
	}
}// verification middleware end here
