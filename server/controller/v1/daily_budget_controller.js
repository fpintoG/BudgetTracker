import { endOfDay, startOfDay } from 'date-fns'
const sendErrorResponse = require('../../utils/errors');
const mongoose = require('mongoose');
const ModelDailyBudget = require('../../models/model_daily_budget');

const listByActualBudget = (req, res, next) => {
    let budgetId = mongoose.Types.ObjectId(req.actualBudgetId);
    ModelDailyBudget.find({ budgetId: budgetId }, (err, dailyBudgets) => {  
        if (err || !dailyBudgets) 
            return sendErrorResponse(err, next, dailyBudgets, 
                                            'Could not find daily budgets');
        res.json({
            result: true,
            data: dailyBudgets
        });  
    });
}

const getByDate = (req, res, next) => {
    ModelDailyBudget.find({budgetId: {$in: req.budgetIds}, 
                            date: {
                                $gte: startOfDay(req.startDate),
                                $lte: endOfDay(req.endDate)
                            }
    })
    .exec( (err, dailyBudgets) => {
        if (err || !dailyBudgets) 
            return sendErrorResponse(err, next, dailyBudgets, 
                                    'Could not find daily budget for this date');
        res.json({
            result: true,
            data: dailyBudgets
        });  
    });
}

module.exports = {
    listByActualBudget,
    getByDate,
};