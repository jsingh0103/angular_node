const dataBase = require('./../db/db')
const response = require('./../libs/responseLib')
const logger = require("./../libs/loggerLib")
const passwordLib = require('./../libs/generatePasswordLib');
const validateInput = require('./../libs/paramsValidationLib')
const check = require('./../libs/checkLib')
const mailer = require('./../libs/mailerLib')
const shortid = require('shortid')
const fs = require('fs')
var path = require("path");


const UserModel = require("./../../models/").users

let signUpFunction = (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    let validateUserInput = () => {
        return new Promise((resolve, reject) => {

                if(check.isEmpty(req.body.first_name)){
                    let apiResponse = response.generate(true, 'Firstname is missing', 400, null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(req.body.last_name)){
                    let apiResponse = response.generate(true, 'Lastname is missing', 400, null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(req.body.user_age)){
                    let apiResponse = response.generate(true, 'Age is missing', 400, null)
                    reject(apiResponse)
                }
            if (!check.isEmpty(req.body.user_email)) {  
                if (!validateInput.Email(req.body.user_email)) {
                    let apiResponse = response.generate(true, 'Email does not meet the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.user_password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or more Parameter(s) is missing', 400, null)
                reject(apiResponse) 
            }
        })
    }

    let createUser = () => {
        return new Promise((resolve, reject) => {
            let email = req.body.user_email
            let user = UserModel.findAll({
                where: {
                  user_email: email
                }
              }).then((data)=>{
                if(check.isEmpty(data)){
                     let u_id = shortid.generate()
                    //  let filename = path.basename(req.body.file)
                     let user_data = {
                         user_id: u_id,
                         first_name: req.body.first_name,
                         last_name: req.body.last_name,
                         user_email: req.body.user_email,
                         user_age: req.body.user_age,
                         user_password: passwordLib.hashpassword(req.body.user_password)
                     }
                     UserModel.create(user_data).
                         then((data) => {
                            mailer.sendConfirmationEmail("Signup Successful","Signup Confirmation","signed-up",req.body.first_name,req.body.user_email)
                            resolve(data)
                         })
                         .catch((error) => {
                         console.log(error);
                     })
                }else{
                     logger.error('User cannot be Created.User already present', 'userController: createUser', 4)
                     let apiResponse = response.generate(true, 'You are already registered. Please login.', 403, null)
                     reject(apiResponse)
                 }
 
              }).catch((err)=>{
                  console.log(err)
              })
        })            
    }           

    validateUserInput(req, res)
    .then(createUser)
    .then((resolve) => {
        let apiResponse = response.generate(false, 'User created', 200, resolve)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log(err);
        res.send(err); 
    })

}



let loginFunction = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    console.log("USER EMAIL "+ req.body.email)
    let findUser = () => {
        console.log("find user start")
        return new Promise((resolve, reject) => {
            if (!validateInput.Email(req.body.email)) {
                let apiResponse = response.generate(true, 'Email does not meet the requirement', 400, null)
                console.log("API RESPONSE IS "+ apiResponse)
                res.send(apiResponse)
            }else{
                UserModel.findOne({
                    where: {
                      user_email: req.body.email
                    }
                  }).then((userDetails)=>{
                    if (check.isEmpty(userDetails)) {
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'Not registered! Please signup.', 404, null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails.dataValues)
                    }
                }).catch((err)=>{
                    let apiResponse = response.generate(true, 'An error occoured', 400, null)
                    reject(apiResponse)
                })
            }
        console.log("find user end")
        })
        
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("VAlidate password start")
        return new Promise((resolve, reject) => {
       
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.user_password, (err, isMatch) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    mailer.sendConfirmationEmail("Login Successful","Login Confirmation","logged in",retrievedUserDetails.first_name,retrievedUserDetails.user_email)
                    resolve(retrievedUserDetails)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
            console.log("validate password end")
        }) 
    }

    

    findUser(req,res)
    .then(validatePassword)
    .then((resolve) => {
        let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
        res.status(200)
        res.send(apiResponse)
    })
    .catch((err) => {
        console.log("errorhandler");
        console.log(err);
        res.send(err)
    })
}


let getParticularUser = (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200') 
    UserModel.findOne({
        where: {
          user_id: req.params.user_id
        }
      }).then((userDetails)=>{
        if (check.isEmpty(userDetails)) {
            logger.error('No User Found', 'userController: getParticularUser()', 7)
            let apiResponse = response.generate(true, 'No User Details Found', 404, null)
            res.send(apiResponse)
        } else {
            logger.info('User Found', 'userController: GetParticularUser()', 10)
            res.send(userDetails.dataValues)
        }
    }).catch((err)=>{
        console.log("error occoured"+err)
        let apiResponse = response.generate(true, 'An error occoured', 400, null)
        res.send(apiResponse)
    })
}

let editUser = (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
    UserModel.findOne({
        where: {
          user_id: req.params.user_id
        }
      }).then((userDetails)=>{
        if(userDetails.user_password == req.body.user_password){
            UserModel.update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                user_age: req.body.user_age
            }, {
                where: {
                  user_id: req.params.user_id
                }
              }).then(function(data) {
                res.send(data)
              }).catch((err)=>{
                  res.send(err)
            });        
        }else{
            UserModel.update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                user_age: req.body.user_age,
                user_password: passwordLib.hashpassword(req.body.user_password)
            }, {
                where: {
                  user_id: req.params.user_id
                }
              }).then(function(data) {
                res.send(data)
              }).catch((err)=>{
                  res.send(err)
              });    
              
        }
    }).catch((error)=>{
        res.send("error occoured.")
    })
}
let uploadFile = async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200') 
        try
        {
          const records= req.body;

          if(records.length>0)
          {
             await  UserModel.bulkCreate(records)
             .then(() => {
               res.status(200).send({
                 message:
                   "Uploaded the file records successfully !!"});         
             })      
             .catch((error) => {
               res.status(500).send({
                 message: "Fail to import data into database!",
                 error: error.message,
               });
             });
            } 
        }
        catch (error) {
          console.log(error);
          res.status(500).send({
            message: "Could not upload the file:"
          });
        }
    }
    getAllUser = (req,res)=>{
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200') 
        UserModel.findAll()
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving Records."
          });
        });
    

    }
module.exports ={
    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    getParticularUser: getParticularUser,
    editUser: editUser,
    uploadFile: uploadFile,
    getAllUser: getAllUser
    // uploadAvatar: uploadAvatar
}