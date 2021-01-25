const ModelDailyBudget = require('../../models/model_daily_budget');
const ModelUser = require('../../models/model_user');

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

const listByUser = async (req, res, next) => {
    let _user_id = req.params.user_id;
    ModelDailyBudget.find({ user_id: _user_id }, (err, items) => {  
        if (err || !items) return errorHandler(err, next, items);
        res.json({
            result: true,
            data: items
        });  
    });
}


module.exports = {
    listByUser,
};