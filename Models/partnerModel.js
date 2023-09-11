import { Schema, model } from "mongoose";

const PartnerScheme = new Schema({
    name:{type:String, required: true},
    email:{type:String, required: true},
    phone:{type:String, required: true},
    password:{type:String, required: true},
    proof:{type:String},
    location:{type:Array},
    isBlocked:{type: Boolean,default:false },
    image: { type: String },
    isApproved: { type: String},

})

export default model("partners", PartnerScheme);