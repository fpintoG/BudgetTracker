var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelTransaction = new Schema({
    dailyBudgetId: {
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

modelTransaction.methods.generateTransaction = function(dailyBudget) {
    const category_index = dailyBudget.categories.findIndex(_category => 
        _category.categoryName === this.category   
    );

    if (category_index > -1) {
        dailyBudget.accAmount += this.amount;
        dailyBudget.aviableAmount -= this.amount;
        dailyBudget.categories[category_index].accAmount += this.amount;
        dailyBudget.categories[category_index].aviableAmount -= this.amount;
        dailyBudget.save();
        return this.save();
    }

    return null;
}

const model = mongoose.model('ModelTransaction', modelTransaction);
module.exports = model;