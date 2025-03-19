const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const analyticsSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "admin",
        required: true
    },
    completedOrders: {
        type: Number,
        default: 0
    },
    newCustomers: {
        type: Number,
        default: 0
    },
    pendingOrders: {
        type: Number,
        default: 0
    },
    cancelledOrders: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    },
    salesVsCustomers: {
        type: Number,
        default: 0
    },
    topReturnedProducts: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "product"
        },
        returnCount: {
            type: Number,
            default: 0
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("analytics", analyticsSchema); 