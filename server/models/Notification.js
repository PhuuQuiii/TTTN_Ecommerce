const mongoose = require('mongoose');
const Schema = mongoose.Schema
const notificationSchema = new mongoose.Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: "admin",
    },
    notifications: [{
        notificationType: String, //order, question_on_product, answer_on_product, review
        notificationDetail: Object, //details in key/value
        hasRead: {
            type: Boolean,
            default: false
        },
        date: {
            type: Date
        },
        // hasSeen: {
        //     type: Boolean,
        //     default: false
        // }
    }],
    noOfUnseen: {
        type: Number,
        default: 0
    }
    
});
module.exports = mongoose.model('notification', notificationSchema);


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