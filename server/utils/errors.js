module.exports = function sendErrorResponse(err, next, item, msg) {
    if(err){      
        return next(err);
    }
    if(!item){
        const error = new Error(msg);
        error.statusCode = 400;
        return next(error);
    }    
}