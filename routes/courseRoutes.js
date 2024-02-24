const express = require('express')
const courseControllers = require('../controllers/courseControllers')
const router =  express.Router()


router.route('/all').get(courseControllers.getAllCourses)
router.route('/count').get(courseControllers.getCourseCount)
router.route('/single/course/:id').get(courseControllers.getSingleCourse)

router.route('/insert/course').post(courseControllers.insertSingelCourse)

router.route('/update/course').patch(courseControllers.updateSingelCourse)


router.route('/delete/course/:id').delete(courseControllers.deleteSingleCourse)

module.exports = router