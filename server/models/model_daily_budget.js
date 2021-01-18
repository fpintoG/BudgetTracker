var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelDailyBudget = new Schema({
    date: {
        type: Date,
        unique: true,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'ModelUser'
    },
    aviable_amount: {
        type: Number,
        require: true
    },
    acc_amount: {
        type: Number,
        default: 0
    },
    categories: [{
        name: {
            type: String,
            unique: true
        },
        aviable_amount: {
            type: Number,
            required: true
        },
        acc_amount: {
            type: Number,
            default: 0
        }
    }]    
});

const model = mongoose.model('ModelDailyBudget', modelDailyBudget);

module.exports = model;