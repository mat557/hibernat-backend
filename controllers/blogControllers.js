const dbConnections = require('../config/dbConnect')
const { ObjectId } = require('mongodb')
const { format } = require('date-fns')

const getBlogCount = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('blogs')
        const document = await collection.estimatedDocumentCount()

        res.status(200).json({
            "documents":document,
            "message":"Successful"
        })
    }catch(err){
        console.log(err)
    }
}

const getAllBlogs = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('blogs')
        const blogs = await collection.find().toArray()

        if(!blogs){
            return res.status(400).json({ "message":"No blogs found"})
        }

        res.status(200).json({
            "blogs":blogs,
            "message":"Successful"
        })
    }catch(err){
        console.log(err)
    }
}

const getSingleBlog = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('blogs')

        const id = req.params

        if(!id){
            return res.status(400).json({ "message":"No id"})
        }

        const query = { _id:new ObjectId(id) }
        const blog = await collection.findOne(query)
        if(!blog){
            return res.status(400).json({ "message":"No blog found with this id"})
        }

        res.status(200).json({
            "blog":blog,
            "message":"Successful"
        })

    }catch(err){
        console.log(err)
    }
}

const insertSingelBlog = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('blogs')
        const { blog_title , blog_author , author_email , blog_content , blog_tag } = req.body

        if(!blog_title || !blog_author || !author_email || !blog_content || !blog_tag ){
            return res.status(400).json({
                "message":"No empty field allowed!"
            })
        }
        const currentDate = new Date()
        const formatted = format(currentDate, "MM/dd/yyyy")

        const insertDoc = {
            blog_title:blog_title,
            blog_author:blog_author,
            author_email:author_email,
            blog_content:blog_content,
            blog_tag:blog_tag,
            postedAt: formatted,
            like_count: 0,
            dislike_count: 0,
            update_count: 0,
        }

        const doc = await collection.insertOne(insertDoc)
        res.json({
            "message": "Blog inserted!",
            'postedAt': formatted,
            "doc" : doc
        })
    }catch(err){
        console.log(err)
    }
}

const updateSingelBlog = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('blogs')
        const { id , blog_title , blog_author , author_email , blog_content , blog_tag } = req.body

        if(!id){
            return res.status(400).json({
                "message":"No id Found!"
            })
        }

        const filter = { _id:new ObjectId(id) }
        const blog = await collection.findOne(filter)

        if(!blog){
            return res.status(400).json({
                "message": "No course found with this id"
            })
        }

        const doc = {
            "blog_author": blog_author ? blog_author : blog.blog_author,
            "author_email": author_email ? author_email : blog.author_email,
            "blog_content": blog_content ? blog_content : blog.blog_content,
            "blog_tag": blog_tag ? blog_tag : blog.blog_tag,
            "blog_title": blog_title ? blog_title : blog.blog_title,
            "update_count": blog.update_count + 1
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

const deleteSingleBlog = async(req,res) =>{
    try{
        const database = await dbConnections()
        const collection = database.collection('blogs')
        const id = req.params

        if(!id){
            return res.status(400).json({
                "message":"No id found",
            })
        }

        const query = { _id:new ObjectId(id) }
        const result = await collection.deleteOne(query)

        if(!result){
            return res.status(400).json({
                "message": "No blog found with this id"
            })
        }


        res.status(200).json({
            "message":"Successful",
            "result":result
        })
        
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getBlogCount,
    getSingleBlog,
    getAllBlogs,
    updateSingelBlog,
    deleteSingleBlog,
    insertSingelBlog
}