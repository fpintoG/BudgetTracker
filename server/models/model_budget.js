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
    acc_amount: {
        type: Number,
        default: 0
    },
    categories: [{
        category_name: {
            type: String,
            unique: true
        },
        max_amount: {
            type: Number,
            required: true
        },
        acc_amount: {
            type: Number,
            default: 0
        }
    }]
})

modelBudget.index(
    {active: 1}, 
    {unique: true, partialFilterExpression: {active: true}}
);


modelBudget.methods.updateBudget = function(last_daily_budget) {
    this.acc_amount += last_daily_budget.acc_amount
    last_daily_budget.categories.map((_daily_category) =>{
        this.categories.map((_budget_category) =>{
            if (_budget_category.category_name === _daily_category.category_name) {
                _budget_category.acc_amount += _daily_category.acc_amount
            }
        })
    })

    return this.save()
}

const model = mongoose.model('ModelBudget', modelBudget);
module.exports = model;