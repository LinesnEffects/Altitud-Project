
const mongoose = require("mongoose")
var usersModel = {}

const Schema = mongoose.Schema

var usersSchema = new Schema({
    name: String,
    lastName: String,
    email: String,
    password: String,
    role: Number,
    codeAct: String,
    status: Number
})

const MyModel = mongoose.model("users", usersSchema)


usersModel.saveUsers = function(post,callback){

    const instance = new MyModel
    instance.name = post.name
    instance.lastName = post.lastName
    instance.email = post.email
    instance.password = post.password
    instance.role = 2
    instance.codeAct = post.myCode
    instance.status = 0

    instance.save().then((responseIdNumber) => {
        console.log(responseIdNumber);
        return callback({ state: true, message: "This register was saved successfully" })
    }).catch((error) => {
        return callback({ state: false, message: "Error while saving" + error })
    })

}

usersModel.toList = function(post, callback) {

    MyModel.find({}, {password: 0, codeAct: 0}).then((res) => {
        return callback(res)
    })
}

usersModel.modify = function(post, callback) {
    
    MyModel.findByIdAndUpdate(post._id, {
        name:post.name,
        lastName:post.lastName,
        role: post.role
    }).then((res) => {
        console.log(res)
        callback({state:true, message: "The register was updated" })
    }).catch((error) => {
        callback({state:false, message:"This register was not found in the database", error:error})
    })
}

usersModel.delete = function(post,callback){
    
    MyModel.findByIdAndDelete(post._id).then((res) => {
        callback({state:true, message:"This register has been deleted"})
    }).catch((error) => {
        callback({state:false, message:"This register does not exist", error: error})
    })
}

usersModel.toListId = function(post, callback) {

    MyModel.find({_id:post._id}, {password: 0, codeAct: 0}).then((res) => {
        return callback(res)
    })
}

usersModel.existentEmail = function(post, callback){

    MyModel.find({email: post.email}, {}).then((responseIdNumber) => {
        console.log(responseIdNumber.length)
        if(responseIdNumber.length == 0){
            return callback({ existent: "No"})
        } else {
            return callback({ existent: "Yes"})
        }
    })
}

usersModel.login = function(post, callback) {

    MyModel.find({email:post.email, password:post.password}, {password: 0, codeAct: 0}).then((res) => {
        
        console.log(res)
        if(res.length == 0){
            return callback({state: false})
        } else{
            return callback({state: true, res: res})
        }
    })
}

usersModel.activeEmail = function(post, callback) {

        MyModel.find({email:post.email}, {status:1}).then((res) => {
            console.log(res)
            if(res.length > 0){
                return callback({state: true, res:res})
            } else{
                return callback({state: false})
            }
        })
}

usersModel.changeStatus = function(post, callback) {
    
    MyModel.findOneAndUpdate({email:post.email, codeAct:post.code}, {
        status:1
    }).then((res) => {
        console.log(res)
        callback({state:true, message: "The register was updated" })
    }).catch((error) => {
        callback({state:false, message:"This register was not found in the database", error:error})
    })
}

usersModel.searchActivationCode = function(post, callback) {

    MyModel.find({email:post.email, codeAct:post.code}, {status: 1}).then((res) => {
        
        console.log(res)
        if(res.length == 0){
            return callback({state: false})
        } else{
            return callback({state: true, status: res[0].status})
        }
    })
}


module.exports.usersModel = usersModel