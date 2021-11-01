let logger = require('pino')()
const moment = require('moment')
let captureError = (errorMessage,errorOrigin,errorLevel)=>{
    let currentTime = moment()
    let errorResponse = {
        timestamp: currentTime,
        error: errorMessage,
        origin: errorOrigin,
        level: errorLevel
    }
    logger.error(errorResponse)
    return errorResponse
}

let captureInfo = (message,origin,importance)=>{
    let currentTime = moment()
    let messageResponse = {
        timestamp: currentTime,
        error: message,
        origin: origin,
        level: importance
    }
    logger.info(messageResponse)
    return messageResponse
}

module.exports = {
    error:captureError,
    info: captureInfo
}
