var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelDailyBudget = new Schema({
    budget_id: {
        type: Schema.Types.ObjectId,
        ref: 'ModelBudget'
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
            type: String
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

modelDailyBudget.methods.generateDailyBudget = async function(budget, transaction_date) {
    // check if actual date is in budget range
    if (transaction_date.getTime() >= budget.start_date.getTime() && 
	   transaction_date.getTime() <= budget.end_date.getTime()) {
		
		last_daily_budget = await this.schema.statics.getLastDailyBudget(budget._id)
		if (last_daily_budget) await budget.updateBudget(last_daily_budget);

        this.budget_id = budget._id;
        this.date = transaction_date;
        this.aviable_amount = budget.max_amount - budget.acc_amount;
        // look for categories
        this.categories = budget.categories.map(_category => {
			let category =  { category_name: _category.category_name, 
							aviable_amount: _category.max_amount - _category.acc_amount};
            return category;
        });
        
        return this.save();
    }
    return null;
}


modelDailyBudget.statics.getLastDailyBudget = function(_budget_id) {
	return mongoose.model('ModelDailyBudget').findOne({budget_id: _budget_id})
					.sort({created_at: -1}).exec();	
}

const model = mongoose.model('ModelDailyBudget', modelDailyBudget);
module.exports = model;