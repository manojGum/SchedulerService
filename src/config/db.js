const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
  // MongoDb Database connection 
const connect = () => {
  return mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`connected to db ${process.env.MONGODB_URI}`);
    })
    .catch((err) => {
      console.log(err.message);
    });

};

module.exports = connect;
