var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelDailyBudget = new Schema({
    budgetId: {
        type: Schema.Types.ObjectId,
        ref: 'ModelBudget'
    },
    date: {
        type: Date,
        required: true
    },
    aviableAmount: {
        type: Number,
        required: true
    },
    accAmount: {
        type: Number,
        default: 0
    },
    updated: {
        type: Boolean,
        default: false
    },
    categories: [{
        categoryName: {
            type: String
        },
        aviableAmount: {
            type: Number,
            required: true
        },
        accAmount: {
            type: Number,
            default: 0
        }
    }]    
});

modelDailyBudget.index({ date: 1, budgetId: 1}, { unique: true });

modelDailyBudget.methods.generateDailyBudget = async function(budget, transactionDate) {
    // check if actual date is in budget range
    if (transactionDate.getTime() >= budget.startDate.getTime() && 
        transactionDate.getTime() <= budget.endDate.getTime()) {
		
        lastDailyDudgets = await this.schema.statics.getLastDailyBudgets(budget._id)
		if (lastDailyDudgets) await budget.updateBudget(lastDailyDudgets);

        this.budgetId = budget._id;
        this.date = transactionDate;
        this.aviableAmount = budget.maxAmount - budget.accAmount;
        // look for categories
        this.categories = budget.categories.map(_category => {
			let category =  { categoryName: _category.categoryName, 
							aviableAmount: _category.maxAmount - _category.accAmount};
            return category;
        });
        
        return this.save();
    }
    return null;
}


modelDailyBudget.statics.getLastDailyBudgets = function(_budgetId) {
    return mongoose.model('ModelDailyBudget').find({budgetId: _budgetId,
                                                updated: false})
                                                .exec();	
}

const model = mongoose.model('ModelDailyBudget', modelDailyBudget);
module.exports = model;