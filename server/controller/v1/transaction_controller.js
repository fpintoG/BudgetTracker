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

function listByDailyBudget(req, res, next) {
    let _daily_budget_id = req.params.daily_budget_id;
    ModelTransaction.find({ daily_budget_id: _daily_budget_id }, (err, items) => {  
        if (err || !items) return errorHandler(err, next, items);
        res.json({
            result: true,
            data: items
        });  
    });
}


module.exports = {
    listByDailyBudget,
};