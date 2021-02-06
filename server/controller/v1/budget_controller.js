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
    let _userId = mongoose.Types.ObjectId(req.params.user_id);
    ModelBudget.find({ user_id: _userId }, (err, items) => {  
        if (err || !items) return sendErrorResponse(err, next, item, 
                                                'Could not find users');  
        res.json({
            result: true,
            data: items
        });  
    });
}

const getActualBudgetId = (req, res, next) => {
    let userId = mongoose.Types.ObjectId(req.userId);
    
    ModelUser.findById(userId)
    .exec( (err, user) => {
        if (err || !user) 
            return sendErrorResponse(err, next, user, 
                                    'Could not find user');
        req.actualBudgetId = user.actualBudget;
        next();
    });
}

const checkActiveBudget = async (req, res, next) => {
    try {
        let isActive = false;
        if (req.actualBudgetId) {
            let activeBudget = await ModelBudget.findById(req.actualBudgetId).exec();
            if (activeBudget) 
                isActive = await activeBudget.checkActiveBudget();
        }

        if (isActive)
            return  sendErrorResponse(null, next, null, 
                    'Found another active budget for this period');
        next();
    } catch {
        console.log(err)
        return sendErrorResponse(err, next, null, null);
    }
}

const createBudget = async (req, res, next) => {
    try {
        // inicio de presupuesto debe ser desde la fecha actual en adelante
        _startDate = new Date(req.body.start_date);  
        if (_startDate < new Date()) _startDate = new Date();

        let data = {
            userId: mongoose.Types.ObjectId(req.userId),
            startDate: _startDate,
            endDate: new Date(req.body.end_date),
            active: req.body.active,
            maxAmount: req.body.max_amount
        }

        let _categories = req.body.categories;
        if (!req.premium && (_categories.length > 5))
            return  sendErrorResponse(null, next, null, 
                                    'Non premium user can not have more than 5 categories');

        let uniqueCategories = [ ...new Set( _categories.map( _category => 
                            _category.category_name) ) ]
                            .map( category_name => 
                                { return _categories.find(_category => 
                                    _category.category_name === category_name) } );
        data['categories'] = uniqueCategories.map(_category => {
            return {'categoryName': _category.category_name, 
                    'maxAmount': _category.max_amount}
        });

        let modelBudget = new ModelBudget( data );
        budget = await modelBudget.save();
        if (!budget) return sendErrorResponse(null, next, budget, 
                                            'Could not save budget');

        await ModelUser.updateOne({ _id: data.userId }, 
                                { actualBudget: budget._id });

        res.json({
            result: true,
            budget: budget
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
        
        let budget = await ModelBudget.findById(mongoose.Types.ObjectId(req.actualBudgetId)).exec();
        if (!budget) return sendErrorResponse(null, next, budget, 
                                        'Budget does not exist');
        
        lastDailyBudgets = await ModelDailyBudget.getLastDailyBudgets(req.actualBudgetId);
        if (lastDailyBudgets) await budget.updateBudget(lastDailyBudgets);
        
        result = await budget.modifyBudget(req.body.category_start, 
                                            req.body.category_dest, 
                                            req.body.amount);
        
        res.json({
            result: true,
            budget: result
        });

    } catch(err) {
        console.log(err)
        return sendErrorResponse(err, next, null, null)
    }
}

module.exports = {      
    getById,
    listByUser,
    getActualBudgetId,
    checkActiveBudget,
    createBudget,
    modifyBudget
};
  