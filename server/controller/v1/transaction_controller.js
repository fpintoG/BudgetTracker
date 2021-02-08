import { endOfDay, startOfDay } from 'date-fns'
const sendErrorResponse = require('../../utils/errors');
const ModelBudget = require('../../models/model_budget');
const ModelDailyBudget = require('../../models/model_daily_budget');
const ModelTransaction = require('../../models/model_transaction');


const listByDailyBudget = (req, res, next) => {
    ModelTransaction.find({dailyBudgetId: {$in: req.dailyBudgetIds}, 
                            date: {
                                $gte: startOfDay(req.startDate),
                                $lte: endOfDay(req.endDate)
    }})
    .exec((err, transactions) => {
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
        let budget = await ModelBudget.findOne({_id: req.actualBudgetId, 
                                                active: 1}).exec();
        if (!budget) return sendErrorResponse(null, next, budget,
                                        'User has no active budget');
        console.log(req.actualBudgetId)
        let transactionDate = new Date(req.body.transaction_date);
        let dailyBudget = await ModelDailyBudget.findOne({
            budgetId: req.actualBudgetId,
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
        console.log(err);
        return sendErrorResponse(err, next, null, null);
    }
}

module.exports = {
    listByDailyBudget,
    makeTransaction,
};