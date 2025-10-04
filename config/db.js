import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL)
        console.log('connected to mongo successfully')
    } catch (error) {
        console.error('cannot connect to db')
        process.exit(1)
    }
}

export default connectDB