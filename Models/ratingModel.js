import { Schema, model ,mongoose} from "mongoose";

const ratingSchema = Schema({
    userId :{type: mongoose.Schema.Types.ObjectId, ref:"users"},
    CarId: {type: mongoose.Schema.Types.ObjectId, ref:"Car"},
    partnerId: {type: mongoose.Schema.Types.ObjectId, ref:"partners"},
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking', 
      },
      stars: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: {
        type: String,
        default: '', 
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

const ratingModel = model("Rating",ratingSchema)
export default ratingModel;