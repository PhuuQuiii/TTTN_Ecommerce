// middleware/helpers.js
const mongoose = require("mongoose");
const Fawn = require("fawn");

let isConnected = false;
let isFawnInitialized = false;

const dbConnection = async () => {
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
    // Delete model nếu tồn tại tránh OverwriteModelError
    if (mongoose.models["_transname_"]) {
      delete mongoose.models["_transname_"];
    }

    Fawn.init(mongoose, process.env.TRANS_COLL || "_transname_");
    isFawnInitialized = true;
    console.log("✅ Fawn initialized");
  }
};

const errorHandler = (err) => {
  return err.message;
};

module.exports = {
  dbConnection,
  errorHandler,
};
