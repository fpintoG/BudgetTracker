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
    modifications: {
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


modelBudget.methods.updateBudget = function(last_daily_budgets) {
    last_daily_budgets.forEach( last_daily_budget =>{
        this.acc_amount += last_daily_budget.acc_amount;
        this.categories.forEach(_category => {
            let index = last_daily_budget.categories.findIndex(
                _daily_category =>
                     _daily_category.category_name === _category.category_name
            );
            if (index > -1)
                _category.acc_amount += last_daily_budget.categories[index].acc_amount;
        })
        last_daily_budget.updated = true;
        last_daily_budget.save()
    });
    return this.save();
}

modelBudget.methods.modifyBudget = function(cat1, cat2, amount) {
    let index1 = this.categories.map(_category => _category.category_name).indexOf(cat1);
    let index2 = this.categories.map(_category => _category.category_name).indexOf(cat2);
    let cat1_diff = this.categories[index1].max_amount - this.categories[index1].acc_amount;
    if ((cat1_diff - amount) > 0) {
        this.categories[index1].max_amount -= amount;
        this.categories[index2].max_amount += amount;
        this.modifications += 1;
        return this.save()
    }
    return null;
}

const model = mongoose.model('ModelBudget', modelBudget);
module.exports = model;