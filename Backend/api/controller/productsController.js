
var productsModel = require("../models/productsModel.js").productsModel

var productsController = {}

productsController.saveProducts = function(request, response) {

    
        var post = {
            code: request.body.code,
            category: request.body.category,
            name: request.body.name,
            description: request.body.description,
            specs: request.body.specs,
            price: request.body.price,
            status: request.body.status
        }
    
        if(post.code == undefined || post.code == null || post.code == ""){
            response.json({state:false, message:"Code field is mandatory"})
            return false
        }

        if(post.category == undefined || post.category == null || post.category == ""){
            response.json({state:false, message:"Category field is mandatory"})
            return false
        }

        if(post.name == undefined || post.name == null || post.name == ""){
            response.json({state:false, message:"Name field is mandatory"})
            return false
        }

        if(post.description == undefined || post.description == null || post.description == ""){
            response.json({state:false, message:"Description field is mandatory"})
            return false
        }
        
        if(post.specs == undefined || post.specs == null || post.specs == ""){
            response.json({state:false, message:"Specs field is mandatory"})
            return false
        }

        if(post.price == undefined || post.price == null || post.price == ""){
            response.json({state:false, message:"Price field is mandatory"})
            return false
        }

        if(post.status == undefined || post.status == null || post.status == ""){
            response.json({state:false, message:"Status field is mandatory"})
            return false
        }

        productsModel.existentCode(post, function(responseIdNumber){

            if (responseIdNumber.existent == "No") {
                productsModel.saveProducts(post, function(responseModel){
                    response.json(responseModel)
                })                
            } else {
                response.json({ state: false, message: "This code already exists, try another Id"})
            }

        })        
        
        
     
}

productsController.toList = function(request, response) {
    productsModel.toList(null,function(responseModel){
        response.json(responseModel)
    })
}

productsController.toListFree = function(request, response) {
    var post = {
        category:request.body.category
    }

    if(post.category == undefined || post.category == null || post.category == ""){
        response.json({state:false, message:"Category field is mandatory"})
        return false
    }

    productsModel.toListFree(post,function(responseModel){
        response.json(responseModel)
    })
}

productsController.modify = function(request, response) {
    
    var post = {
        _id:request.body._id,
        category: request.body.category,
        name: request.body.name,
        description: request.body.description,
        specs: request.body.specs,
        price: request.body.price,
        status: request.body.status
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"_id field is mandatory"})
        return false
    }

    if(post.category == undefined || post.category == null || post.category == ""){
        response.json({state:false, message:"Category field is mandatory"})
        return false
    }

    if(post.name == undefined || post.name == null || post.name == ""){
        response.json({state:false, message:"Name field is mandatory"})
        return false
    }

    if(post.description == undefined || post.description == null || post.description == ""){
        response.json({state:false, message:"Description field is mandatory"})
        return false
    }
    
    if(post.specs == undefined || post.specs == null || post.specs == ""){
        response.json({state:false, message:"Specs field is mandatory"})
        return false
    }

    if(post.price == undefined || post.price == null || post.price == ""){
        response.json({state:false, message:"Price field is mandatory"})
        return false
    }

    if(post.status == undefined || post.status == null || post.status == ""){
        response.json({state:false, message:"Status field is mandatory"})
        return false
    }
    

    productsModel.modify(post, function(responseModel) {
            response.json(responseModel)
        })    
}

productsController.delete = function(request, response) {
    var post = {
        _id:request.body._id
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"_id field is mandatory"})
        return false
    }   
    
    productsModel.delete(post,function(responseModel){
        response.json(responseModel)
    })
}

productsController.toListId = function(request, response) {

    var post = {
        _id:request.body._id
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"_id field is mandatory"})
        return false
    }   

    productsModel.toListId(post,function(responseModel){
        response.json(responseModel)
    })
}

productsController.uploadFile = function(request, response) {

    var post = {
        name: request.params.name
    }

    if(post.name == undefined || post.name == null || post.name == ""){
        response.json({state:false, message:"Name field is mandatory"})
        return false
    }

    const storage = multer.diskStorage({
        destination:(request,file, cb) => { // cb = callback
            cb(null,"products/")
        },
        filename:(request,file, cb) => {
            cb(null,post.name + '.png')
        }
    })

    // File filter
    const fileFilter = (request,file,cb) => {
        const supportedExtensions = [".jpg", ".jpeg", ".png", ".gif"]

        var extension = path.extname(file.originalname).toLocaleLowerCase()


        if(supportedExtensions.includes(extension)){
            // Accept file
            cb(null,true)
        } else {
            cb({ message:"Only the following extensions are accepted: " + supportedExtensions.join(" | ")}, false)
            // return cb(response.end("Only image files are supported"),null)
        }
    }

    const upload = multer({storage,fileFilter}).single("file")

    upload(request,response, function(err){
        if (err) {
            console.log(err)
            response.json({ state: false, message: err.message})
        } else {
            console.log("Everything is alright")
            response.json({ state: true, message: "The file was loaded"})
        }
    })
}


module.exports.productsController = productsController