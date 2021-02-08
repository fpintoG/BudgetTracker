const sendErrorResponse = require('../../utils/errors');
const mongoose = require('mongoose');
const ModelBudget = require('../../models/model_budget');
const ModelDailyBudget = require('../../models/model_daily_budget');
const ModelUser = require('../../models/model_user');

const getById = (req, res, next) => {
    let id = mongoose.Types.ObjectId(req.params.id);  
    ModelBudget.findById(id, (err, item) => {  
        if (err || !item) return sendErrorResponse(err, next, item, 
                                                    'Does not exist');      
        res.json({
            result: true,
            data: item
        }); 
    });
}

const listByUser = (req, res, next) => {
    let userId = mongoose.Types.ObjectId(req.userId);
    ModelBudget.find({ user_id: userId }, (err, items) => {  
        if (err || !items) return sendErrorResponse(err, next, item, 
                                                'Could not find user');  
        res.json({
            result: true,
            data: items
        });  
    });
}

const createBudget = async (req, res, next) => {
    try {
        // starting date must be equal or higher than current date
        _startDate = new Date(req.body.start_date);  
        if (_startDate < new Date()) _startDate = new Date();

        let _categories = req.body.categories;
        if (!req.premium && (_categories.length > 5))
            return  sendErrorResponse(null, next, null, 
                                    'Non premium user can not have more than 5 categories');

        let uniqueCategories = [ ...new Set( _categories.map( _category => 
                            _category.category_name) ) ]
                            .map( category_name => 
                                { return _categories.find(_category => 
                                    _category.category_name === category_name) } );
        
        let fixedCategories = uniqueCategories.map(_category => {
                                return {'categoryName': _category.category_name, 
                                        'maxAmount': _category.max_amount}
                            });

        let maxAmount = fixedCategories.map(a => a.maxAmount)
                                       .reduce((acc, val) => acc + val, 0);
        let data = {
            userId: mongoose.Types.ObjectId(req.userId),
            startDate: _startDate,
            endDate: new Date(req.body.end_date),
            active: 1,
            maxAmount: maxAmount,
            categories: fixedCategories,
        }

        let modelBudget = new ModelBudget( data );
        budget = await modelBudget.save();
        if (!budget) return sendErrorResponse(null, next, budget, 
                                            'Could not save budget');

        await ModelUser.updateOne({ _id: data.userId }, 
                                { actualBudget: budget._id });

        res.json({
            result: true,
            data: budget
        });

    } catch(err) {
        console.log(err)
        return sendErrorResponse(err, next, null, null);
    }
}    


const modifyBudget = async (req, res, next) => {
    try {
        if (!req.actualBudgetId)
            return sendErrorResponse(null, next, null, 
                                'Could not find active budget asociated with user');
        
        let budgetId = mongoose.Types.ObjectId(req.actualBudgetId)
        let budget = await ModelBudget.findOne({_id: budgetId, active: 1}).exec();
        if (!budget) return sendErrorResponse(null, next, budget, 
                                        'Active budget does not exist');

        if (!req.premium && (budget.modifications > 10))
            return  sendErrorResponse(null, next, null, 
                                    'Non premium user can not make more than 10 budget modifications');
        
        lastDailyBudgets = await ModelDailyBudget.getLastDailyBudgets(req.actualBudgetId);
        if (lastDailyBudgets) await budget.updateBudget(lastDailyBudgets);
        
        result = await budget.modifyBudget(req.body.category_start, 
                                            req.body.category_dest, 
                                            req.body.amount);
        
        if (!result) return sendErrorResponse(null, next, result, 
                                            'Not valid modification');
            
        res.json({
            result: true,
            data: result
        });

    } catch(err) {
        console.log(err)
        return sendErrorResponse(err, next, null, null)
    }
}


const getActualBudget = (req, res, next) => {
    let budgetId = mongoose.Types.ObjectId(req.actualBudgetId)
    ModelBudget.findById(budgetId)
    .exec( (err, budget) => {
        if (err || !budget) 
            return sendErrorResponse(err, next, budget, 
                                    'Could not find budget');
        res.json({
            result: true,
            data: budget
        });
    });
}

const getBugdetByRange = (req, res, next) => {
    let userId = mongoose.Types.ObjectId(req.userId);
    let start = new Date(req.query.start_date);
    let end = new Date(req.query.end_date);
    ModelBudget.find({userId: userId, 
                      startDate: {"$gte": start}, 
                      endDate: {"$lt": end}})
    .exec((err, budgets) => {
        if (err || !budgets) 
            return sendErrorResponse(err, next, budgets, 
                                    'Could not find budget in this date range');
        res.json({
            result: true,
            data: budgets
        });
    });    
}

const deactivateBudget = async (req, res, next) => {
    try {
        let budgetId = mongoose.Types.ObjectId(req.actualBudgetId)
        await ModelBudget.updateOne({_id: budgetId}, 
                                    { active: 0, endDate: new Date()});
        
        res.json({
            result: true,
            data: 'Budget no longer active'
        });
    } catch(err) {
        console.log(err)
        return sendErrorResponse(err, next, null, null)
    }
}

module.exports = {      
    getById,
    listByUser,
    createBudget,
    modifyBudget,
    getActualBudget,
    getBugdetByRange,
    deactivateBudget,
};
  