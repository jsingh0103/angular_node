
const express = require('express')
const router = express.Router()
const userController = require('./../controllers/userController')
const appConfig = require('./../../config/appConfig')
const fileUpload = require('./../middlewares/uploadFile')

module.exports.setRouter = (app)=>{
    let baseUrl = appConfig.apiVersion + "/users"

    app.get(baseUrl + "/user/:user_id",userController.getParticularUser)

    app.put(baseUrl + "/edit/:user_id",userController.editUser)

    app.post(baseUrl + "/signup",fileUpload.upload.single('avatar'),userController.signUpFunction)

    app.post(baseUrl + "/login",userController.loginFunction)
    
    app.post(baseUrl + "/uploadcsv",userController.uploadFile)
    
    app.get(baseUrl + "/all",userController.getAllUser)
}

