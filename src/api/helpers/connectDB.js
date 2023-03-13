import mongoose  from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()


const connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ie213-cluster.kpoiox5.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(connectionString,
    {
        dbName: process.env.MONGO_DBNAME
    }
)

// CONNECT MONGODB
const db = mongoose.connection;

export default db