import { endOfDay, startOfDay } from 'date-fns'
const sendErrorResponse = require('../../utils/errors');
const mongoose = require('mongoose');
const ModelUser = require('../../models/model_user');
const ModelBudget = require('../../models/model_budget');
const ModelDailyBudget = require('../../models/model_daily_budget');
const ModelTransaction = require('../../models/model_transaction');


/*
* Param transactions date
*/
const addTransactionsDate = (req, res, next, date) => {
    req.budgetDate = new Date(date.replace(/-/g, '\/'));
    next();
}

const listByDailyBudget = (req, res, next) => {
    ModelTransaction.find({ dailyBudgetId: req.dailyBudgetId  }, (err, transactions) => {
        if (err || !transactions)
            return sendErrorResponse(err, next, transactions, 
                                        'Could not find transactions for this date');
        res.json({
            result: true,
            data: transactions
        });
    });
}

const makeTransaction = async (req, res, next) => {
    try {
        let userId = mongoose.Types.ObjectId(req.user.userId);
        let user = await ModelUser.findById(userId).exec(); 
        if (!user) return sendErrorResponse(null, next, user, 
                                         'Could not find user');
            
        let budget = await ModelBudget.findById(user.actualBudget).exec();
        if (!budget) return sendErrorResponse(null, next, budget,
                                        'User has no active budget');

        let transactionDate = new Date(req.body.transaction_date);
        let dailyBudget = await ModelDailyBudget.findOne({
            budgetId: budget._id,
            date: {
                $gte: startOfDay(transactionDate),
                $lte: endOfDay(transactionDate)
            }
        }).exec(); 

        if (!dailyBudget) {
            dailyBudget = await new ModelDailyBudget()
                                    .generateDailyBudget(budget, transactionDate);
            if (!dailyBudget) return sendErrorResponse(null, next, dailyBudget,
                                                'User could not creaate daily budget');
        }

        let data = {
            dailyBudgetId : dailyBudget._id,
            date : transactionDate,
            amount : req.body.amount,
            category : req.body.category,
        }
        if (req.body.hasOwnProperty('description')) 
            data['description'] = req.body.description

        let tran = await new ModelTransaction(data).generateTransaction(dailyBudget);
        if (!tran) return sendErrorResponse(null, next, tran,
                                    'Transaction not saved');
        
        res.json({
            result: true,
            data: tran
        });

    } catch (err) {
        console.log(err);SSS
        return sendErrorResponse(err, next, null, null);
    }
}

module.exports = {
    addTransactionsDate,
    listByDailyBudget,
    makeTransaction,
};