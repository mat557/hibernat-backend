const jwt = require('jsonwebtoken')
const dbConnections = require('../config/dbConnect')
const bcrypt = require('bcrypt')


const getAllUserCount = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('users')
        const document = await collection.estimatedDocumentCount()

        return res
        .status(200)
        .json({
            "documents":document,
            "message": 'Received data'
        })
    }catch(err){
        console.log(err)
    }
}

const getAllUsers = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('users')
        const users = await collection.find({})

        if (!users){
            return res
            .status(400)
            .json({ "message": "No user found!" })
        }

        return res
        .status(200)
        .json({
            "documents":users,
            "message": 'Users found'
        })
    }catch(err){
        console.log(err)
    }
}


const getSingleUser = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('users')

    }catch(err){
        console.log(err)
    }
}


const signUpUser = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('users')

        const { firstname , number , email , password } = req.body

        if(!email || !password){
            return res
            .status(400)
            .json({ "message": "Failed. No empty field allowed!" })
        }

        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            return res
            .status(404)
            .json({ "message": "Invalid email format!" })
        }
        const query = { email : email }
        const duplicate = await collection.findOne(query)

        if(duplicate){
            return res
            .status(400)
            .json({ "message": "User with this email exist! Please login." })
        }

        if(password.length < 8){
            return res
            .status(400)
            .json({ "message": "Invalid password length " })
        }

        const saltRounds = 10
        const hashedPass = await bcrypt.hash(password,saltRounds)

        userDoc = {
            first_name : firstname,
            number : number ,
            email: email,
            password: hashedPass,
            role: {}
        }

        const response = await collection.insertOne(userDoc)
        
        const refresh_token = jwt.sign(
            { 
                email:email,
                role: {}
            },
            process.env.REFRESH_TOKEN,
            {expiresIn: '2h'}
        )

        const access_token = jwt.sign(
            { 
                email:email,
                role: {}
            },
            process.env.REFRESH_TOKEN,
            {expiresIn: '15m'}
        )

        if(response){
            res.cookie('refresh_token', refresh_token, {
                maxAge: 1000 * 60 * 45, 
                httpOnly: true, 
                signed: true 
            })
            return res
            .status(200)
            .json({ 
                "response": response,
                "access_token": access_token,
                "message": "User created successfully." 
            })
        }else{
            return res
            .status(400)
            .json({ 
                "response": response,
                "message": "Failed. No empty field allowed!" 
            })
        }
    }catch(err){
        console.log(err)
    }
}


const loginUser = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('users')

        const { email , password } = req.body


        if(!email || !password){
            return res
            .status(400)
            .json({ "message": "Failed. No empty field allowed!" })
        }

        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
            return res
            .status(400)
            .json({ "message": "Invalid email format!" })
        }
        const query = { email : email }
        const user = await collection.findOne(query)

        if(!user){
            return res
            .status(400)
            .json({
                "message":"No user found with this email. Please signup."
            })
        }

        const match = await bcrypt.compare(password,user.password)

        if(!match) {
            return res
            .status(400)
            .json({
                "message":"Invalid password!"
            })
        }

        const refresh_token = jwt.sign({ 
                email:email,
                role: user.role
            },
            process.env.REFRESH_TOKEN,
            {expiresIn: '1d'}
        )

        const access_token = jwt.sign({ 
                email:email,
                role: user.role
            },
            process.env.ACCESS_TOKEN,
            {expiresIn: '15m'}
        )


        res.cookie('refresh_token', refresh_token, {
            expiresIn:1000*60*60*24*19,
            path: "/",
            sameSite: 'None',
            httpOnly: false,
            secure: true,
        })

        res
        .status(200).json({ 
            "access_token": access_token,
            "refresh_token": refresh_token,
            "message": "Login successfully." 
        })

    }catch(err){
        console.log(err)
    }
}

const updateUser = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('users')

    }catch(err){
        console.log(err)
    }
}

const logOutUser = async(req,res) =>{
    try{
        // const database = await dbConnections()
        // const collection = database.collection('users')

        // const { email , password } = req.body

        // if(!email || !password){
        //     return res
        //     .status(400)
        //     .json({ "message": "Failed. No empty field allowed!" })
        // }

        // if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        //     return res
        //     .status(404)
        //     .json({ "message": "Invalid email format!" })
        // }

        // const query = { email : email }
        // const user = await collection.findOne(query)

        // if(!user){
        //     return res
        //     .status(400)
        //     .json({
        //         "message":"No user found with this email. Please signup."
        //     })
        // }

        res.clearCookie('refresh_token')

        res.status(200).json({
            "message" : "Logout successfull",
        })

    }catch(err){
        console.log(err)
    }
}




const deleteUser = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('users')

    }catch(err){
        console.log(err)
    }
}


const consistUser = async(req,res) =>{
    // const cookies = req.cookies
    // console.log(cookies)
    // if(!cookies?.refresh_token) return res.status(400).json({ message : "Unaothorized"})
    // const refreshToken = cookies.refresh_token

    const refresh_token = req.params.token
    jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN,
        async (err,decoded) =>{
            if(err) return res.status(400).json({ message : "forbidden"})
        
            const access_token = jwt.sign({ 
                email:decoded.email,
                role: decoded.role
            },
                process.env.ACCESS_TOKEN,
                {expiresIn: '15m'}
            )

            res.status(200).json({ 'access_token':access_token })

        }
    )
}


module.exports = {
    getAllUserCount,
    loginUser,
    getAllUsers,
    getSingleUser,
    signUpUser,
    updateUser,
    logOutUser,
    deleteUser,
    consistUser
}