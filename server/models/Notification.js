const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
    // For user notifications
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // For admin notifications
    admin: {
        type: Schema.Types.ObjectId,
        ref: "admin"
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['order', 'order_status', 'payment', 'system', 'question_on_product', 'answer_on_product', 'review'],
        required: true
    },
    orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order"
    },
    // For admin notifications
    notifications: [{
        notificationType: String,
        notificationDetail: Object,
        hasRead: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    noOfUnseen: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Ensure either user or admin is set, but not both
notificationSchema.pre('save', function(next) {
    if ((!this.user && !this.admin) || (this.user && this.admin)) {
        next(new Error('Notification must have either a user or an admin, but not both'));
    }
    next();
});

module.exports = mongoose.model('Notification', notificationSchema);


// admin:

// Kiểu: Schema.Types.ObjectId
// Tham chiếu đến collection "admin".
// Xác định admin nào nhận được thông báo.
// notifications (Mảng chứa các thông báo của admin):

// notificationType: Loại thông báo (có thể là "order", "question_on_product", "answer_on_product", "review").
// notificationDetail: Một object chứa thông tin chi tiết của thông báo (tùy vào loại thông báo).
// hasRead: Trạng thái đã đọc (true hoặc false, mặc định là false).
// date: Thời gian tạo thông báo.
// noOfUnseen:

// Kiểu: Number
// Lưu số lượng thông báo chưa đọc.
// Mặc định là 0.