const { MongoClient } = require("mongodb")

const client = new MongoClient(process.env.DB_URI)


let database
const dbConnections = async() =>{
    try {
        await client.connect()
        console.log('Connected to MongoDB')
        database = client.db('spectrum-collection')
        return database
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw error
    }
}

module.exports = dbConnections