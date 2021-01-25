import { endOfDay, startOfDay } from 'date-fns'

const ModelUser = require('../../models/model_user');
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
        let user_id = req.params.user_id;
        user = await ModelUser.findById(user_id).exec(); 
        if (!user) sendErrorResponse(res, 'Could not find user');

        let transaction_date = new Date(req.params.transaction_date);
        console.log(transaction_date);
        let daily_budget = await ModelDailyBudget.findOne({
            date: {
                $gte: startOfDay(transaction_date),
                $lte: endOfDay(transaction_date)
            }
        }).exec(); 

        if (!daily_budget) {
            daily_budget = await new ModelDailyBudget().generateDailyBudget(user);
            if (!daily_budget) sendErrorResponse(res, 'User has no active budget');
        }

        let data = {
            daily_budget_id : daily_budget._id,
            date : transaction_date,
            amount : req.params.amount,
            category : req.params.category
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