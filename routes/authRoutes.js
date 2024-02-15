const express = require('express')
const router =  express.Router()
const authControllers = require('../controllers/authControllers')

router.route('/user/total').get(authControllers.getAllUserCount) //get all user count
router.route('/user/all').get(authControllers.getAllUsers) //get all user
router.route('/user/single').get(authControllers.getSingleUser) //get single user


router.route('/user/signup').post(authControllers.signUpUser) //signup a user
router.route('/user/login').post(authControllers.loginUser) //login a user


router.route('/user/update').patch(authControllers.updateUser) //path a  user

router.route('/user/delete').delete(authControllers.deleteUser) //delete user


module.exports = router