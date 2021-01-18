var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelBudget = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'ModelUser'
    },
    start_date : {
        type: Date,
        required: true,  
    },
    end_date : {
        type: Date,
        required: true,  
    },
    active: {
        type: Boolean,
        default: false
    },
    max_amount: {
      type: Number,
      required: true
    },
    categories: [{
        name: {
            type: String,
            unique: true
        },
        max_amount: {
            type: Number,
            required: true
        }
    }]
})

modelBudget.index(
    {active: 1}, 
    {unique: true, partialFilterExpression: {active: true}}
);

const model = mongoose.model('ModelBudget', modelBudget);

module.exports = model;