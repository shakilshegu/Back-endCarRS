import { Schema, model, mongoose } from "mongoose";

const cancellSchema = new Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  reason: { type: String },
});

export default model("cancellation", cancellSchema);
