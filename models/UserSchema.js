import mongoose from "mongoose";
const Schema = mongoose.Schema

const userSChema = new Schema({
    email:{ type: String , required:true , unique: true },
    password:{ type:String },
    name:{ type:String , required:true }
})

export default mongoose.model('users' , userSChema)