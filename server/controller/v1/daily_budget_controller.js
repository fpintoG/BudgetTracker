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


/*
* Param budget date
*/
const addBudgetDate = (req, res, next, date) => {
    req.budgetDate = new Date(date.replace(/-/g, '\/'));
    next();
}


const getByDate = (req, res, next) => {
    let budgetId = mongoose.Types.ObjectId(req.budgetId);
    ModelDailyBudget.findOne({budgetId: budgetId, date: {
                            $gte: startOfDay(req.budgetDate),
                            $lte: endOfDay(req.budgetDate)
                        }
    })
    .exec( (err, dailyBudget) => {
        if (err || !dailyBudget) 
            return sendErrorResponse(err, next, dailyBudget, 
                                    'Could not find daily budget for this date');
        res.json({
            result: true,
            data: dailyBudget
        });  
    });
}

module.exports = {
    listByActualBudget,
    addBudgetDate,
    getByDate,
};