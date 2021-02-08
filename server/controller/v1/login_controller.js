
const ModelUser= require('../../models/model_user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


function errorHandler(err, next, item) {
	if (err) {
		return next(err);
	}
	if (!item) {
		const error = new Error('Wrong user or password');
		error.statusCode = 401;
		return next(error);
	}
}

const login = (req, res, next) => {

	let email = req.body.email;
	let password = req.body.password;  

	console.log(email)
	ModelUser.findOne({ email: email}, (err, item) =>{
		if(err || !item )
			return errorHandler(err, next, item)

		if (!bcrypt.compareSync(password, item.password) ){
			return res.status(401).json({
				result: true,
				message: 'Wrong user or password'
			});
		}

		let payload ={
			userId: item._id,
			role: item.role
		}

		let token = jwt.sign(
			payload,
			process.env.SEED,
			{ expiresIn: process.env.CADUCIDAD_TOKEN  }
		);

		let user = item.toObject();
		delete user.password;

		res.json({
			result: true,
			data: {
			user_id: item._id,
			role: item.role,
			token: token
			}
		});

	}) 
}

const signin = (req, res, next) => {

	let salt = parseInt(process.env.SALT)

	let data = {
		name : req.body.name,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, salt),   
		role : req.body.role
	}

	let modelUser = new ModelUser(data);

	modelUser.save((err, item) => {

		if (err || !item) return errorHandler(err, next, item);

		let payload = {
			usuarioId: item._id,
			role: item.role
		}

		let token = jwt.sign(
			payload,
			process.env.SEED,
			{ expiresIn: process.env.CADUCIDAD_TOKEN }
		);
		res.json({
			result: true,
			data: {
			userId: item._id,
			role: item.role,
			token: token
			}
		})

	});
}

const logout = (req, res) => {
	if(req.session){
		req.session.destroy( item => {
		res.json({
			result: true
		})
		})
	}
}

module.exports = {
  signin,
  login,
  logout
};
