import { Schema, model } from "mongoose"

const categorySchema=new Schema( {
     name:{
        type:String,
        required:true
    },
    isListed:{
        type:Boolean,
        default:true
    }
})

export default model("category",categorySchema)