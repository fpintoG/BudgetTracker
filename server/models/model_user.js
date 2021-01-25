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
        start_date : {
            type: Date,
            required: true
        },
        end_date : {
			type: Date,
			required: true  
        },
        autoRenewal: {
            type: Boolean,
            default: true
        },
        max_amount: {
			type: Number,
			required: true
		},
		categories: [{
			category_name: {
				type: String,
				unique: true
			},
			max_amount: {
				type: Number,
				required: true
			}
		}]
    }
});


const model = mongoose.model('ModelUser', modelUser);
module.exports = model;