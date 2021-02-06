import { endOfDay, startOfDay } from 'date-fns'
const sendErrorResponse = require('../../utils/errors');
const mongoose = require('mongoose');
const ModelUser = require('../../models/model_user');
const ModelBudget = require('../../models/model_budget');
const ModelDailyBudget = require('../../models/model_daily_budget');
const ModelTransaction = require('../../models/model_transaction');

function listByDailyBudget(req, res, next) {
    let _daily_budget_id = req.params.daily_budget_id;
    ModelTransaction.find({ daily_budget_id: _daily_budget_id }, (err, items) => {
        if (err || !items)
            return sendErrorResponse(err, next, items, 
                                        'Does not exist');
        res.json({
            result: true,
            data: items
        });
    });
}

const makeTransaction = async (req, res, next) => {
    try {
        let user_id = mongoose.Types.ObjectId(req.user_id);
        let user = await ModelUser.findById(user_id).exec(); 
        if (!user) return sendErrorResponse(null, next, user, 
                                         'Could not find user');
            
        let budget = await ModelBudget.findById(user.actual_budget).exec();
        if (!budget) return sendErrorResponse(null, next, budget,
                                        'User has no active budget');

        let transaction_date = new Date(req.body.transaction_date);
        let daily_budget = await ModelDailyBudget.findOne({
            budget_id: budget._id,
            date: {
                $gte: startOfDay(transaction_date),
                $lte: endOfDay(transaction_date)
            }
        }).exec(); 

        if (!daily_budget) {
            daily_budget = await new ModelDailyBudget()
                                    .generateDailyBudget(budget, transaction_date);
            if (!daily_budget) return sendErrorResponse(null, next, daily_budget,
                                                'User could not creaate daily budget');
        }

        let data = {
            daily_budget_id : daily_budget._id,
            date : transaction_date,
            amount : req.body.amount,
            category : req.body.category
        }

        let tran = await new ModelTransaction(data).generateTransaction(daily_budget);
        if (!tran) return sendErrorResponse(null, next, tran,
                                    'Transaction not saved');
        
        res.json({
            result: true,
            transaction: tran
        });

    } catch (err) {
        console.log(err);
        return sendErrorResponse(err, next, null, null);
    }
}

module.exports = {
    listByDailyBudget,
    makeTransaction
};