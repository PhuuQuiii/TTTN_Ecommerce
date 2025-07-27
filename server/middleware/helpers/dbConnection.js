const mongoose = require("mongoose");
const Fawn = require("fawn");

let isConnected = false;
let isFawnInitialized = false;

module.exports = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected:", mongoose.connection.db.databaseName);
  }

  if (!isFawnInitialized) {
    // Nếu model `_transname_` đã tồn tại, xoá nó
    if (mongoose.models['_transname_']) {
      delete mongoose.models['_transname_'];
    }

    Fawn.init(mongoose, process.env.TRANS_COLL || "transactions");
    isFawnInitialized = true;
    console.log("✅ Fawn initialized");
  }
};
