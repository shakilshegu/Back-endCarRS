import { hash } from "bcrypt";

const securePassword = async(password)=>{
    const hashedPassword = await hash(password,10)
    return hashedPassword;
}

export default securePassword