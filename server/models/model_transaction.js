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
    description: {
        type: String
    }
})

const model = mongoose.model('ModelTransaction', modelTransaction);

module.exports = model;