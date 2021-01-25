var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelDailyBudget = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'ModelUser'
    },
    date: {
        type: Date,
        unique: true,
        required: true
    },
    aviable_amount: {
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

modelDailyBudget.methods.generateDailyBudget = function(docUser) {
    let current_date = new Date();
    let budget_model = docUser.actual_budget

    // check if actual date is in budget range
    if (current_date.getTime() >= budget_model.start_date.getTime() && 
        current_date.getTime() <= budget_model.end_date.getTime()) {
        this.user_id = docUser._id
        this.date = current_date
        this.aviable_amount = budget_model.max_amount
        // look for categories
        budget_model.categories.map((_category) =>{
            let category =  { category_name: _category.category_name, aviable_amount: _category.max_amount }
            this.categories.push(category)
        })
        return this.save()
    }
    return null
}

const model = mongoose.model('ModelDailyBudget', modelDailyBudget);
module.exports = model;