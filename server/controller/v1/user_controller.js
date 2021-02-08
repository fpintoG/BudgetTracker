const ModelUser = require('../../models/model_user');

function errorHandler(err, next, item) {
    if (err) {  
        return next(err);
    }
    if (!item) {
        const error = new Error('Does not exist');
        error.statusCode = 500;
        return next(error);
    } 
  
}
  
const userById = (req, res, next ,id) => {

    ModelUser.findById(id)
    .where({ active : true })
    .exec( (err, item)=>{
        if (err || !item) 
            return errorHandler(err,next,item);
        req.docUser = item;
        next();
    });

}

const getUser = async (req, res) => {

    res.json({
        result: true,
        data: req.docUser
    })

}

module.exports = {
    userById,
    getUser,
};

  