var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelUser = new Schema({
    name: {
		type: String,
		required: true
    },
    email: {
		type: String,
		required: true,
		unique: true
    },
    password: {
		type: String,
		required: true
    },
    role: {
		type: String,
		default: 'USER_ROLE'
    },
    active: {
		type: Boolean,
		default: true
    },
    actual_budget: {
		type: Schema.Types.ObjectId,
		ref: 'ModelBudget'
    }
});


const model = mongoose.model('ModelUser', modelUser);
module.exports = model;