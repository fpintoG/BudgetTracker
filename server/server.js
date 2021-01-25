const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const session = require('express-session');
var cors = require('cors')
const bcrypt = require('bcrypt');

const routersV1 = require('./routers/v1/index');
const app = express();

const ModelUser = require('./models/model_user');

if (process.env.NODE_ENV === 'development'){
	console.log('development env');
	require('dotenv').config({
		path: `${__dirname}/../.env.development`
	})
} else{
	console.log('production env');
	require('dotenv').config()
}

const URL_MONGO = process.env.URL_MONGO;
console.log(URL_MONGO);

app.use(cors({
    credentials: true,
    origin: true
}));
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	secret: 'secret-session',
	resave: false,
	saveUninitialized: true, //Crea la cookie id al inicio default
	cookie: { secure: false },
	httpOnly: false
}));

routersV1(app);

app.use( (error, req, res, next) =>{
    console.log(error);
    
    const status= error.statusCode || 500;
    const message = error.message;
    const data = error.data;
  
    res.status(status).json({
		result: false,
		message: message,
		data: data
    })  
});

mongoose.connect(URL_MONGO, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
}).then( ()=> {
	console.log('Mongo OK')

	ModelUser.findOne(
		{ email: 'admin@test.com' }, (err, user) => {
		if (!user) {

			let data = {
				name: 'admin',
				email: 'admin@test.com',
				password: bcrypt.hashSync('123456', 10),
				role: 'ADMIN_ROLE',
				actual_budget: {
					start_date: new Date('2021/01/02'),
					end_date: new Date('2021/02/03'),
					max_amount: 500000,
					categories: [
						{
							category_name: "comida",
							max_amount: 200000
						},
						{
							category_name: "transporte",
							max_amount: 100000
						},
						{
							category_name: "gastos_medicos",
							max_amount: 100000
						},
						{
							category_name: "estudios",
							max_amount: 100000
						}
					]
				}
			}
			console.log('save............')
			new ModelUser(data).save();
		}
	});

	app.listen(process.env.PORT, () => {
		console.log('Server Ok');
	})
});