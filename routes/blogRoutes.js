const express = require('express')
const blogControllers = require('../controllers/blogControllers')
const router =  express.Router()


router.route('/all').get(blogControllers.getAllBlogs)
router.route('/count').get(blogControllers.getBlogCount)
router.route('/single/blog/:id').get(blogControllers.getSingleBlog)

router.route('/insert/blog').post(blogControllers.insertSingelBlog)

router.route('/update/blog').patch(blogControllers.updateSingelBlog)


router.route('/delete/blog/:id').delete(blogControllers.deleteSingleBlog)

module.exports = router