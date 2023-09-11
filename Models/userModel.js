import { Schema, model } from "mongoose";

const userSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: true, 
  },
  isUser:{
    type:Boolean,
    default:false,
  },
  image:{type:String, default: "https://bootdey.com/img/Content/avatar/avatar7.png"},
  Licence:{ type:String }
}
,{
    timestamps: true,
});

const userModel = model("users", userSchema);
export default userModel;