require("dotenv").config();

module.exports = {
  mongoURI:
    process.env.MONGO_URI ||
    "mongodb+srv://your_username:your_password@cluster0.mongodb.net/your_database?retryWrites=true&w=majority",
  port: process.env.PORT || 5000,
};
