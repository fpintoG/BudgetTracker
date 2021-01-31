var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelTransaction = new Schema({
    daily_budget_id: {
        type: Schema.Types.ObjectId,
        ref: 'ModelDailyBudget'
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

modelTransaction.methods.generateTransaction = function(daily_budget) {
    const category_index = daily_budget.categories.findIndex(_category => 
        _category.category_name === this.category   
    );

    if (category_index > -1) {
        daily_budget.acc_amount += this.amount;
        daily_budget.aviable_amount -= this.amount;
        daily_budget.categories[category_index].acc_amount += this.amount;
        daily_budget.categories[category_index].aviable_amount -= this.amount;
        daily_budget.save();
        return this.save();
    }

    return null;
}

const model = mongoose.model('ModelTransaction', modelTransaction);
module.exports = model;