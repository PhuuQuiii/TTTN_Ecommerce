const mongoose = require("mongoose");
const Fawn = require("fawn");

let isConnected = false;
let isFawnInitialized = false;

module.exports = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log("✅ MongoDB connected:", mongoose.connection.db.databaseName);
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      throw err;
    }
  }

  if (!isFawnInitialized) {
    // Xóa model nếu đã tồn tại để tránh OverwriteModelError
    if (mongoose.models["_transname_"]) {
      delete mongoose.models["_transname_"];
    }

    Fawn.init(mongoose, process.env.TRANS_COLL || "_transname_");
    isFawnInitialized = true;
    console.log("✅ Fawn initialized");
  }
};
