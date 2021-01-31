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
            required: true
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
});

modelBudget.index(
    {active: 1}, 
    {unique: true, partialFilterExpression: {active: true}}
);


modelBudget.methods.updateBudget = function(last_daily_budget) {
    this.acc_amount += last_daily_budget.acc_amount;
    this.categories.forEach(_category => {
        let index = last_daily_budget.categories.findIndex(
            _daily_category =>
                 _daily_category.category_name === _category.category_name
        );
        if (index > -1)
            _category.acc_amount += last_daily_budget.categories[index].acc_amount;
    })

    return this.save();
}

const model = mongoose.model('ModelBudget', modelBudget);
module.exports = model;