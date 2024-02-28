require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOption = require('./config/corsOption')
const PORT = process.env.PORT || 3500
const authHandler = require('./routes/authRoutes')
const courseRoutes = require('./routes/courseRoutes')
const blogRoutes = require('./routes/blogRoutes')


// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true, 
// }))
app.use(cookieParser())
app.use(cors(corsOption))
app.use(express.json())


app.use('/',authHandler)
app.use('/courses',courseRoutes)
app.use('/blogs',blogRoutes)

app.get('/',(req,res)=>{
    res.status(200).json({ 'message': 'Server responding successfully.'})
})

app.all("*",(req,res) => {
    res.status(404).json({'message':'Not found!'})
})

app.listen(PORT , ()=>{
    console.log(`Server is running in port ${PORT}`)
})