const { Schema, model, Types } = require("mongoose");

// product
const productSchema = Schema({
  name: { type: String, required: true },
  weigth: { type: String, required: true },
  photo: { type: String, required: true },
  price: { type: Number, required: true },
  pid: { type: String, required: true }
});

const Product = model('Product', productSchema);



// orders
const orderSchema = Schema({
    user: { type: String, required: true },
    products: [{
        type: Object,
        required: true
    }],
    cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'processing'
    }
}, {
    timestamps: true
});

const Order = model('Order', orderSchema);


// exports
module.exports = {
    Product,
    Order
};