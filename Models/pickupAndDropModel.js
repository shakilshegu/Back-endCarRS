import {Schema,model} from "mongoose"

const pickeupSchema = Schema({
    pickLocation:{
      type:String,
      required:true
    }
})

const pickModel = model("locations",pickeupSchema);
export default pickModel