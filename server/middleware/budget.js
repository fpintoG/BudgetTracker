const sendErrorResponse = require('../utils/errors');
const mongoose = require('mongoose');
const ModelUser = require('../models/model_user');
const ModelBudget = require('../models/model_budget');

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

const getBudgetIdByDate = (req, res, next) => {
    let userId = mongoose.Types.ObjectId(req.userId);
    let start = new Date(req.query.start_date.replace(/-/g, '\/'));
    let end = new Date(req.query.end_date.replace(/-/g, '\/'));
    ModelBudget.find({userId: userId,
                    startDate: {"$gte": start},
                    endDate: {"$lt": end}})
    .exec( (err, budgets) => {
        if (err || !budgets) 
            return sendErrorResponse(err, next, budgets, 
                                    'Could not find budgets');
        req.budgetIds = budgets.map(budget => budget._id);
        req.startDate = start;
        req.endDate = end;
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

module.exports = {      
    getActualBudgetId,
    checkActiveBudget,
    getBudgetIdByDate,
};
  