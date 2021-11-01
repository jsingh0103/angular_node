let isEmpty = (value)=>{
    if(value == null || value == "" || value == "undefined" || value.length == 0){
        return true
    }else{
        return false
    }
}

module.exports = {
    isEmpty: isEmpty
}