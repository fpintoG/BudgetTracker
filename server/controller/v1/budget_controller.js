const sendErrorResponse = require('../../utils/errors');
const mongoose = require('mongoose');
const ModelBudget = require('../../models/model_budget');
const ModelUser = require('../../models/model_user');

const getById = (req, res, next) => {
    let id = req.params.id;  
    ModelBudget.findById(id, (err, item) => {  
        if (err || !item) return sendErrorResponse(err, next, item, 
                                                    'Does not exist');      
        res.json({
            result: true,
            data: item
        }); 
    });
}

function listByUser(req, res, next) {
    let _user_id = req.params.user_id;
    ModelBudget.find({ user_id: _user_id }, (err, items) => {  
        if (err || !items) return sendErrorResponse(err, next, item, 
                                                'Could not find users');  
        res.json({
            result: true,
            data: items
        });  
    });
}


const createBudget = async (req, res, next) => {
    try {
        let data = {
            user_id: mongoose.Types.ObjectId(req.body.user_id),
            start_date: new Date(req.body.start_date),
            end_date: new Date(req.body.end_date),
            active: req.body.active,
            max_amount: req.body.max_amount
        }
        const user_exist = await ModelUser.exists({ _id: data.user_id });
        if (!user_exist) sendErrorResponse(null, next, budget, 
                                        'User does not exist');

        let _categories = req.body.categories;
        let unique_categories = [ ...new Set( _categories.map( _category => 
                            _category.category_name) ) ]
                            .map( category_name => 
                                { return _categories.find(_category => 
                                    _category.category_name === category_name) } );
        data['categories'] = unique_categories;

        let modelBudget = new ModelBudget( data );
        budget = await modelBudget.save();
        if (!budget) return sendErrorResponse(null, next, budget, 
                                            'Could not save budget');

        await ModelUser.updateOne({ _id: data.user_id }, 
                                { actual_budget: budget._id });

        res.json({
            result: true,
            budget: budget
        });

    } catch(err) {
        console.log(err)
        return sendErrorResponse(err, next, null, null);
    }
}    

module.exports = {      
    getById,
    listByUser,
    createBudget
};
  