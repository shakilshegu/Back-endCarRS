import mongoose from "mongoose";

// Connect to MongoDB
mongoose.connect("mongodb+srv://shakil:shakil1212@cluster0.2pkhiac.mongodb.net/CarRentalServices", {
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
