const dbConnections = require('../config/dbConnect')
const { ObjectId } = require('mongodb')

const getCourseCount = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('course')
        const document = await collection.estimatedDocumentCount()

        res.status(200).json({
            "documents":document,
            "message":"Successful"
        })
    }catch(err){
        console.log(err)
    }
}

const getAllCourses = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('course')
        const courses = await collection.find().toArray()

        if(!courses){
            return res.status(400).json({ "message":"No course found"})
        }

        res.status(200).json({
            "courses":courses,
            "message":"Successful"
        })
    }catch(err){
        console.log(err)
    }
}

const getSingleCourse = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('course')

        const id = req.params

        if(!id){
            return res.status(400).json({ "message":"No id"})
        }

        const query = { _id:new ObjectId(id) }
        const course = await collection.findOne(query)
        if(!course){
            return res.status(400).json({ "message":"No course found"})
        }

        res.status(200).json({
            "courses":course,
            "message":"Successful"
        })

    }catch(err){
        console.log(err)
    }
}

const insertSingelCourse = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('course')
        const {course_title,course_nmbr,course_exam,course_assignment,code,course_description,course_fee} = req.body
        
        if(!course_title || !course_nmbr || !course_exam || !course_assignment || !code || !course_description || !course_fee){
            return res.status(400).json({
                "message":"No empty field allowed!"
            })
        }

        const insetDoc = {
            course_title:course_title,
            course_nmbr:course_nmbr,
            course_exam:course_exam,
            course_assignment:course_assignment,
            code:code,
            course_description:course_description,
            course_fee:course_fee
        }

        const doc = await collection.insertOne(insetDoc)
        res.json({
            "message": "Course inserted!",
            "doc" : doc
        })
    }catch(err){
        console.log(err)
    }
}

const updateSingelCourse = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('course')
        const { id , course_assignment , code , course_description , course_exam , course_fee , course_nmbr , course_title } = req.body

        if(!id){
            return res.status(400).json({
                "message":"No id Found!"
            })
        }

        const filter = { _id:new ObjectId(id) }
        const course = await collection.findOne(filter)

        if(!course){
            return res.status(400).json({
                "message": "No course found with this id"
            })
        }

        const doc = {
            "code": code ? code : course.code,
            "course_assignment": course_assignment ? course_assignment : course.course_assignment,
            "course_description": course_description ? course_description : course.course_description,
            "course_exam": course_exam ? course_exam : course.course_exam,
            "course_fee": course_fee ? course_fee : course.course_fee,
            "course_nmbr": course_nmbr ? course_nmbr : course.course_nmbr,
            "course_title": course_title ? course_title : course.course_title
        }

        const options = { upsert: true };

        const updateDoc = {
          $set: doc
        }
        const result = await collection.updateOne(filter , updateDoc , options)
        res.json({
            "message": "done",
            "doc" : result
        })
    }catch(err){
        console.log(err)
    }
}

const deleteSingleCourse = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('course')
        const id = req.params

        if(!id){
            return res.status(400).json({
                "message":"No id found",
            })
        }

        const query = { _id:new ObjectId(id) }
        const result = await collection.deleteOne(query)

        if(result.deletedCount === 1){
            res.status(200).json({
                "message":"Successful",
                "result":result
            })
        }else{
            res.status(400).json({
                "message":"Failed",
                "result":result
            })
        }
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getCourseCount,
    getSingleCourse,
    getAllCourses,
    updateSingelCourse,
    deleteSingleCourse,
    insertSingelCourse
}