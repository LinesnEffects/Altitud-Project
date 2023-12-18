
var mandatorySession = function(request, response, next){
    var userId = request.session._id

    if(userId == undefined || userId == null || userId == ""){
        response.json({state:false, message:"Please log in to continue"})
    } else{
        next()
    }
}

var adminOnly = function(request, response, next){
    var role = request.session.role

    if(role != 1){
        response.json({state:false, message:"Only admins can use this Api"})
    } else{
        next()
    }
}



var peopleController = require("./api/controller/peopleController.js").peopleController

app.post("/people/savePeople", mandatorySession, adminOnly, function(request, response){
     peopleController.savePeople(request, response)
})

app.post("/people/toList", mandatorySession, function(request, response){
     peopleController.toList(request, response)
})

app.post("/people/modify", mandatorySession, function(request, response){
    peopleController.modify(request, response)
})

app.post("/people/delete", mandatorySession, function(request, response){
    peopleController.delete(request, response)
})

app.post("/people/toListId", mandatorySession, function(request, response){
    peopleController.toListId(request, response)
})





var usersController = require("./api/controller/usersController.js").usersController

app.post("/users/saveUsers", function(request, response){
     usersController.saveUsers(request, response)
})

app.post("/users/toList", adminOnly, function(request, response){
     usersController.toList(request, response)
})

app.post("/users/modify", function(request, response){
    usersController.modify(request, response)
})

app.post("/users/delete", function(request, response){
    usersController.delete(request, response)
})

app.post("/users/toListId", function(request, response){
    usersController.toListId(request, response)
})

app.post("/users/login", function(request, response){
    usersController.login(request, response)
})

app.post("/users/activateAccount", function(request, response){
    usersController.activateAccount(request, response)
})

app.post("/users/status", function(request, response){
    response.json(request.session)
})

app.post("/users/logout", function(request, response){
    request.session.destroy()
    response.json({ state:true, message: "You signed out" })
})

app.post("/users/uploadFile/:something", mandatorySession, function(request, response){
    usersController.uploadFile(request, response)
})





var productsController = require("./api/controller/productsController.js").productsController

app.post("/products/saveProducts", mandatorySession, adminOnly, function(request, response){
     productsController.saveProducts(request, response)
})

app.post("/products/toList", mandatorySession, adminOnly, function(request, response){
     productsController.toList(request, response)
})

app.post("/products/toListFree", function(request, response){
    productsController.toListFree(request, response)
})

app.post("/products/modify", mandatorySession, adminOnly, function(request, response){
    productsController.modify(request, response)
})

app.post("/products/delete", mandatorySession, adminOnly, function(request, response){
    productsController.delete(request, response)
})

app.post("/products/toListId", function(request, response){
    productsController.toListId(request, response)
})

app.post("/products/uploadFile/:name", function(request, response){
    productsController.uploadFile(request, response)
})


