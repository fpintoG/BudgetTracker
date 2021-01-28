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
})

modelTransaction.methods.generateTransaction = function(dailyBudget) {
    dailyBudget.acc_amount += this.amount;
    dailyBudget.aviable_amount -= this.amount;
    dailyBudget.categories.map((_category) => {
        if (_category.category_name === this.category) {
            _category.acc_amount += this.amount;
            _category.aviable_amount -= this.amount;
        }
    })
    dailyBudget.save()

    return this.save()
}

const model = mongoose.model('ModelTransaction', modelTransaction);
module.exports = model;