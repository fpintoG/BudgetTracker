var jwt = require('jsonwebtoken');

let isAuth = (req, res, next) => {
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

let isAdmin = (req, res, next) => {
  	let user = req.user;
	if(user.role === 'ADMIN_ROLE'){
		req.user_id = user.user_id;
		next();
	}else{
		let err = new Error('Not valid role');
		err.statusCode = 401;
		next(err)
	}
}

let isPremium = (req, res, next) => {
	let user = req.user;
	req.user_id = user.user_id;
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