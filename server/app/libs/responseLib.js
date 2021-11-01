let generate = (err,message,statuss,data)=>{
    let apiResposne = {error: err,
        message: message,
        status: statuss,
        data: data
    }
    return apiResposne
}

module.exports = {
    generate: generate
}