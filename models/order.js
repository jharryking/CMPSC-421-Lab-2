const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 60
    },
    productPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function(n){
                return n && n >= 0;
            },
            message: 'Price needs to be greater than or equal to 0'
        }
    },
    productQuantity: {
        type: Number,
        required: true,
        validate: {
            validator: function(n){
                return n && Number.isInteger(n) && n > 0;
            },
            message: 'Quantity needs to be an integer greater than 0'
        }
    },
    canceled: {
        type: Boolean,
        default: false,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    completionDate:{
        type: Date,
        default: null
    },
    customerID: {
        type: mongoose.ObjectId,
        // required: true
    },
    supplierID: {
        type: mongoose.ObjectId,
        //required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;