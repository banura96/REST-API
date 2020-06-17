const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency

var promoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true   
    },
    lable:{
        type: String,
        default: ''   
    },
    
    price:{
        type: Currency,
        required: true          
    },
    description: {
        type: String,
        required: true
    },
    featured:{
        type: Boolean,
        default: false  
    },
}, {
    timestamps: true
});

var Promotions = mongoose.model('Promotion', promoSchema);

module.exports = Promotions;