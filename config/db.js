import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const db = await mongoose.connect("mongodb://localhost:27017/blockchain")
        console.log('connected to mongo successfully')
    } catch (error) {
        process.exit(1)
        console.error('cannot connect to db')
    }
}

export default connectDB