const http = require('http')
const express = require('express')
const app = express()
const appConfig = require('./config/appConfig')
const fs = require('fs')
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler')
const cookieParser = require('cookie-parser')
const methodOverride = require("method-override")
const cors = require('cors')

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
}));

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(globalErrorMiddleware.globalErrorHandler)
app.use(cookieParser())
app.use(methodOverride())
app.use(cors())

let routesPath = "./app/routes"
fs.readdirSync(routesPath).forEach((file)=>{
    if(file.indexOf(".js")){
        let route = require(routesPath + "/" + file)
        route.setRouter(app)
    }
})
app.use(globalErrorMiddleware.globalNotFoundHandler)


let server = http.createServer(app)
server.listen(appConfig.port,()=>{
    console.log("Server listening on port 3000.")
})