import { endOfDay, startOfDay } from 'date-fns'
const sendErrorResponse = require('../utils/errors');
const mongoose = require('mongoose');
const ModelDailyBudget = require('../models/model_daily_budget');

const findDailyBudgetId = (req, res, next) => {
    let budgetId = mongoose.Types.ObjectId(req.budgetId);
    ModelDailyBudget.findOne({budgetId: budgetId, date: {
        $gte: startOfDay(req.budgetDate),
        $lte: endOfDay(req.budgetDate)
    }
    })
    .distinct('_id', (err, id) => {
        if (err || !id)
            return sendErrorResponse(err, next, id, 
                                        'Could not find daily budget');
        req.dailyBudgetId = id;
        next();
    });
}

module.exports = {
    findDailyBudgetId,
};