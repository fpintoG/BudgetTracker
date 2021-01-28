import { endOfDay, startOfDay } from 'date-fns'
const mongoose = require('mongoose');
const ModelUser = require('../../models/model_user');
const ModelBudget = require('../../models/model_budget');
const ModelDailyBudget = require('../../models/model_daily_budget');
const ModelTransaction = require('../../models/model_transaction');


function errorHandler(err, next, item) {
    if(err){      
        return next(err);
    }
    if(!item){
        const error = new Error('Does not exist');
        error.statusCode = 500;
        return next(error);
    }    
}

function sendErrorResponse(res, err) {
    return res.status(400).send({
              msg: err
    });
}

function listByDailyBudget(req, res, next) {
    let _daily_budget_id = req.params.daily_budget_id;
    ModelTransaction.find({ daily_budget_id: _daily_budget_id }, (err, items) => {
        if (err || !items)
            return errorHandler(err, next, items);
        res.json({
            result: true,
            data: items
        });
    });
}

const makeTransaction = async (req, res, next) => {
    try {
        let user_id = mongoose.Types.ObjectId(req.body.user_id);
        let user = await ModelUser.findById(user_id).exec(); 
        if (!user) sendErrorResponse(res, 'Could not find user');

        let transaction_date = new Date(req.body.transaction_date);
        let daily_budget = await ModelDailyBudget.findOne({
            date: {
                $gte: startOfDay(transaction_date),
                $lte: endOfDay(transaction_date)
            }
        }).exec(); 

        if (!daily_budget) {
            let budget = await ModelBudget.findById(user.actual_budget).exec(); 
            if (!budget) sendErrorResponse(res, 'User has no active budget');
            daily_budget = await new ModelDailyBudget()
                                    .generateDailyBudget(budget, transaction_date);
        }

        let data = {
            daily_budget_id : daily_budget._id,
            date : transaction_date,
            amount : req.body.amount,
            category : req.body.category
        }

        let tran = await new ModelTransaction(data).generateTransaction(daily_budget);

        if (!tran) {
            sendErrorResponse(res, 'Transaction not saved');
        }

        res.json({
            result: true,
            transaction: tran
        });

    } catch (err) {
        console.log(err);
        sendErrorResponse(res, err);
    }
}

module.exports = {
    listByDailyBudget,
    makeTransaction
};