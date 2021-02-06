var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelBudget = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'ModelUser'
    },
    startDate : {
        type: Date,
        required: true,  
    },
    endDate : {
        type: Date,
        required: true,  
    },
    active: {
        type: Boolean,
        default: false
    },
    maxAmount: {
      type: Number,
      required: true
    },
    accAmount: {
        type: Number,
        default: 0
    },
    modifications: {
        type: Number,
        default: 0
    },
    categories: [{
        categoryName: {
            type: String,
            required: true
        },
        maxAmount: {
            type: Number,
            required: true
        },
        accAmount: {
            type: Number,
            default: 0
        }
    }]
});

modelBudget.index(
    {active: 1}, 
    {unique: true, partialFilterExpression: {active: true}}
);


modelBudget.methods.updateBudget = function(lastDailyBudgets) {
    lastDailyBudgets.forEach( lastDailyBudget =>{
        this.accAmount += lastDailyBudget.accAmount;
        this.categories.forEach(_category => {
            let index = lastDailyBudget.categories.findIndex(
                _dailyCategory =>
                     _dailyCategory.categoryAame === _category.categoryName
            );
            if (index > -1)
                _category.accAmount += lastDailyBudget.categories[index].accAmount;
        })
        lastDailyBudget.updated = true;
        lastDailyBudget.save()
    });
    return this.save();
}

modelBudget.methods.modifyBudget = function(cat1, cat2, amount) {
    let index1 = this.categories.map(_category => _category.categoryName).indexOf(cat1);
    let index2 = this.categories.map(_category => _category.categoryName).indexOf(cat2);
    let cat1Diff = this.categories[index1].maxAmount - this.categories[index1].accAmount;
    if ((cat1Diff - amount) > 0) {
        this.categories[index1].maxAmount -= amount;
        this.categories[index2].maxAmount += amount;
        this.modifications += 1;
        return this.save()
    }
    return null;
}


modelBudget.methods.checkActiveBudget = function() {    
    let actualDate = new Date();
    if (actualDate < this.startDate.getTime() ||
        actualDate > this.endDate.getTime()) {
        this.active = false; 
    }
    this.save();
    return this.active;
}

const model = mongoose.model('ModelBudget', modelBudget);
module.exports = model;