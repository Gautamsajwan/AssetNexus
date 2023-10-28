import mongoose from 'mongoose'
import 'dotenv/config'

const mongoURI = process.env.MONGO_URI

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("connected to MongoDB")
    } catch (err) {
        console.error(err);
    }
}

export {connectToMongo}