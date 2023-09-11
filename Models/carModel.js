import { Schema, model,mongoose } from "mongoose";

const carSchema = new Schema({
  name: { type: String, required: true },
  partnerId: {type: mongoose.Schema.Types.ObjectId, ref:"partners"},
  brand: { type: String, required: true },
  category: {type: mongoose.Schema.Types.ObjectId, ref: "category", required: true }, 
  year: { type: Number, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  mileage: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  features: [String],
  createdAt: { type: Date, default: Date.now },
  description: { type: String, required: true },
  location: { type: String, required: true },
  Images: { type: Array },
  carNo: { type: Number, required: true },
});

export default model("Car", carSchema);
