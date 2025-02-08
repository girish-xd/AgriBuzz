const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const db = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log("MONGO DB CONNECTION FAILED!", err);
    process.exit(1);
  }
};

module.exports = db;
