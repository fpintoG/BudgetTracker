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
    updated: {
        type: Boolean,
        default: false
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
		
        last_daily_budgets = await this.schema.statics.getLastDailyBudgets(budget._id)
		if (last_daily_budgets) await budget.updateBudget(last_daily_budgets);

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


modelDailyBudget.statics.getLastDailyBudgets = function(_budget_id) {
    return mongoose.model('ModelDailyBudget').find({budget_id: _budget_id,
                                                updated: false})
                                                .exec();	
}

const model = mongoose.model('ModelDailyBudget', modelDailyBudget);
module.exports = model;