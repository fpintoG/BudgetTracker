const ModelBudget = require('../../models/model_budget');

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

const getById = (req, res, next) => {
    let id = req.params.id;  
    ModelBudget.findById(id, (err, item) => {  
        if (err || !item) return errorHandler(err, next, item);      
        res.json({
            result: true,
            data: item
        }); 
    });
}

function listByUser(req, res, next) {
    let _user_id = req.params.user_id;
    ModelBudget.find({ user_id: _user_id }, (err, items) => {  
        if (err || !items) return errorHandler(err, next, items);
        res.json({
            result: true,
            data: items
        });  
    });
}


module.exports = {
    getById,
    listByUser,
};
  