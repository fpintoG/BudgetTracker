var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelBudget = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'ModelUsuario'
    }, 
    categories: [{
        name: {
            type: String,
            unique: true
        },
        maxAmount: {
            type: Number,
            required: true
        }
    }]    
});



const model = mongoose.model('ModelBudget', modelBudget);

module.exports = model;