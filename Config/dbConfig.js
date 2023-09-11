import mongoose from "mongoose";

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/CarRentalServices", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("mongoose connected");
});

connection.on("error", (error) => {
  console.log("error:", error);
});

export default connection;
