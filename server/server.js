const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const session = require('express-session');
var cors = require('cors')
const bcrypt = require('bcrypt');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const routersV1 = require('./routers/v1/index');
const app = express();

const ModelUser = require('./models/model_user');
const ModelBudget = require('./models/model_budget');

if (process.env.NODE_ENV === 'development'){
	console.log('development env');
	require('dotenv').config({
		path: `${__dirname}/../.env.development`
	})
} else{
	console.log('production env');
	require('dotenv').config()
}

const swaggerDefinition = {
	info: {
	  // API informations (required)
	  title: 'Budget tracker', // Title (required)
	  version: '1.0.0', // Version (required)
	  description: 'An api to manage budgets', // Description (optional)
	},
	securityDefinitions:{
		bearerAuth: {
			type: 'apiKey',
			name: 'Authorization',
			in: 'header',
		},
	},
 	host: `localhost:${process.env.PORT}`, // Host (optional)
	basePath: '/api/v1/', // Base path (optional)
};
  
// Options for the swagger docs
const options = {
	// Import swaggerDefinitions
	swaggerDefinition,
	// Path to the API docs
	// Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
	apis: ['./server/routers/v1/login_router.js', './server/routers/v1/*.js'],
};
  
const swaggerDocs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
}).then( async ()=> {
	console.log('Mongo OK')

	await ModelUser.findOne(
		{ email: 'admin@test.com' }, async (err, user) => {
		if (!user) {

			let data = {
				name: 'admin',
				email: 'admin@test.com',
				password: bcrypt.hashSync('123456', 10),
				role: 'ADMIN_ROLE'
			}
			console.log('save............')
			user = await new ModelUser(data).save();
			
			data = {
				userId: user._id,
				startDate: new Date('2021/01/02'),
				endDate: new Date('2021/02/03'),
				active: 1,
				maxAmount: 500000,
				categories: [
					{
						categoryName: "comida",
						maxAmount: 200000
					},
					{
						categoryName: "transporte",
						maxAmount: 100000
					},
					{
						categoryName: "gastos_medicos",
						maxAmount: 100000
					},
					{
						categoryName: "estudios",
						maxAmount: 100000
					}
				]
			}
		
			let budget = await new ModelBudget(data).save();
		
			user.actualBudget = budget._id;
			user.save()
		}
	});

	app.listen(process.env.PORT, () => {
		console.log('Server Ok');
	})
});