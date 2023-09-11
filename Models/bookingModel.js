import { Schema, model,mongoose } from "mongoose";

const bookingSchema = Schema({
    name: { type: String  },
    partnerId: {type: mongoose.Schema.Types.ObjectId, ref:"partners"},
    CarId: {type: mongoose.Schema.Types.ObjectId, ref:"Car"},
    userId :{type: mongoose.Schema.Types.ObjectId, ref:"users"},
    brand: { type: String},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "category"},
    IsBooked:{ type:Boolean , default:false },
    location: { type: String},
    startDate: { type: Date }, 
    endDate: { type: Date },
    totalAmount: { type: Number},
    status: { type: String, enum: ["pending", "confirmed", "delivered", "canceled"], default: "pending" },
    pickuplocation: { type: String},
    Dropeuplocation: { type: String},
    RatingId: {type: mongoose.Schema.Types.ObjectId, ref:"Rating"},

},{
    timestamps: true, 
})

const bookingModel = model("Booking",bookingSchema)
export default bookingModel