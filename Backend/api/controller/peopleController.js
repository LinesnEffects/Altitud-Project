
var peopleModel = require("../models/peopleModel.js").peopleModel

var peopleController = {}

peopleController.savePeople = function(request, response) {

    try {
        var post = {
            idNumber: request.body.idNumber,
            name: request.body.name,
            age: request.body.age
        }
    
        if(post.idNumber == undefined || post.idNumber == null || post.idNumber == ""){
            response.json({state:false, message:"idNumber field is mandatory"})
            return false
        }

        if(post.name == undefined || post.name == null || post.name == ""){
            response.json({state:false, message:"name field is mandatory"})
            return false
        }

        if(post.age == undefined || post.age == null || post.age == ""){
            response.json({state:false, message:"age field is mandatory"})
            return false
        }

        peopleModel.existentIdNumber(post, function(responseIdNumber){
            console.log(responseIdNumber)
            if (responseIdNumber.existent == "No") {
                peopleModel.savePeople(post, function(responseModel){
                    response.json(responseModel)
                })                
            } else {
                response.json({ state: false, message: "The Id Number already exists, try another Id"})
            }

        })

        
        
        
    } catch (error) {
        response.json({ state: false, message: "Unexpected error", error:error })
    }
}

peopleController.toList = function(request, response) {
    peopleModel.toList(null,function(responseModel){
        response.json(responseModel)
    })
}

peopleController.modify = function(request, response) {
    
    var post = {
        _id:request.body._id,
        idNumber: request.body.idNumber,
        name: request.body.name,
        age: request.body.age,
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"_id field is mandatory"})
        return false
    }

    if(post.idNumber == undefined || post.idNumber == null || post.idNumber == ""){
        response.json({state:false, message:"idNumber field is mandatory"})
        return false
    }

    if(post.name == undefined || post.name == null || post.name == ""){
        response.json({state:false, message:"name field is mandatory"})
        return false
    }

    if(post.age == undefined || post.age == null || post.age == ""){
        response.json({state:false, message:"age field is mandatory"})
        return false
    }

    peopleModel.modify(post, function(responseModel) {
        response.json(responseModel)
    })
    
}

peopleController.delete = function(request, response) {
    var post = {
        _id:request.body._id
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"_id field is mandatory"})
        return false
    }   
    
    peopleModel.delete(post,function(responseModel){
        response.json(responseModel)
    })
}

peopleController.toListId = function(request, response) {

    var post = {
        _id:request.body._id
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"_id field is mandatory"})
        return false
    }   

    peopleModel.toListId(post,function(responseModel){
        response.json(responseModel)
    })
}


module.exports.peopleController = peopleController