
const mongoose = require("mongoose")
var peopleModel = {}

const Schema = mongoose.Schema

var peopleSchema = new Schema({
    idNumber: Number,
    name: String,
    age: Number
})

const MyModel = mongoose.model("people", peopleSchema)


peopleModel.savePeople = function(post,callback){

    const instance = new MyModel
    instance.idNumber = post.idNumber
    instance.name = post.name
    instance.age = post.age

    instance.save().then((responseIdNumber) => {
        console.log(responseIdNumber);
        return callback({ state: true, message: "This register was saved successfully" })
    }).catch((error) => {
        return callback({ state: false, message: "Error while saving" + error })
    })

}

peopleModel.toList = function(post, callback) {

    MyModel.find({}, {}).then((res) => {
        return callback(res)
    })
}

peopleModel.modify = function(post, callback) {
    
    MyModel.findByIdAndUpdate(post._id, {
        idNumber:post.idNumber,
        age:post.age,
        name:post.name
    }).then((res) => {
        console.log
        callback({state:true, message: "The register was updated" })
    }).catch((error) => {
        callback({state:false, message:"This register was not found in the database", error:error})
    })
}

peopleModel.delete = function(post,callback){
    
    MyModel.findByIdAndDelete(post._id).then((res) => {
        callback({state:true, message:"This register has been deleted"})
    }).catch((error) => {
        callback({state:false, message:"This register does not exist", error: error})
    })
}

peopleModel.toListId = function(post, callback) {

    MyModel.find({_id:post._id}, {}).then((res) => {
        return callback(res)
    })
}

peopleModel.existentIdNumber = function(post, callback){

    console.log(post)
    MyModel.find({idNumber: post.idNumber},{}).then((responseIdNumber) => {
        console.log(responseIdNumber.length)
        if(responseIdNumber.length == 0){
            return callback({ existent: "No"})
        } else {
            return callback({ existent: "Yes"})
        }
    })
}

module.exports.peopleModel = peopleModel