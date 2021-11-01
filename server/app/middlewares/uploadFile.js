const multer = require('multer')

const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log("here")
        cb(null,"C:/Users/rajni/login_app/app/images")
    },
    filename:(req,file,cb)=>{
        console.log("here ")
        cb(null,file.originalname)
    }       
})


let upload = multer({storage: fileStorageEngine})

module.exports = {
    upload: upload
}