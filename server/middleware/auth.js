var jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  	let token = req.get('Authorization');  
	jwt.verify(token, process.env.SEED, (err, decoded) => {
		if(err){
			err.statusCode = 401;
			next(err);
		}
		req.user = decoded;
		next();
	});
}

const isAdmin = (req, res, next) => {
  	let user = req.user;
	if(user.role === 'ADMIN_ROLE'){
		req.userId = user.userId;		
		next();
	}else{
		let err = new Error('Not valid role');
		err.statusCode = 401;
		next(err)
	}
}

const isPremium = (req, res, next) => {
	let user = req.user;
	req.userId = user.userId;
	req.premium = false;
	if(user.role === 'PREMIUM_ROLE' || 
		user.role === 'ADMIN_ROLE'){
		req.premium = true;
	}
  	next();
}


module.exports = {
	isAuth,
	isAdmin,
	isPremium
}