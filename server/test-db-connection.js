// test-db-connection.js
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI environment variable is not defined");
  process.exit(1);
}

console.log("Attempting to connect to MongoDB...");
console.log(`URI: ${MONGO_URI}`);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // Timeout after 10s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log("✅ MongoDB Connected!");
    console.log(`Database name: ${mongoose.connection.db.databaseName}`);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log("Connection closed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.error("Error details:", err);
    process.exit(1);
  });
