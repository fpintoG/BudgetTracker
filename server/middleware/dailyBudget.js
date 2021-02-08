import { endOfDay, startOfDay } from 'date-fns'
const sendErrorResponse = require('../utils/errors');
const ModelDailyBudget = require('../models/model_daily_budget');

const findDailyBudgetId = (req, res, next) => {
    ModelDailyBudget.find({budgetId: {$in: req.budgetIds}, 
                           date: {
                                $gte: startOfDay(req.startDate),
                                $lte: endOfDay(req.endDate)
                           }
    }, {_id: 1})
    .exec((err, ids) => {
        if (err || !ids)
            return sendErrorResponse(err, next, ids, 
                                        'Could not find daily budgets');
        req.dailyBudgetIds = ids;
        next();
    });
}

module.exports = {
    findDailyBudgetId,
};