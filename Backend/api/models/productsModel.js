
const mongoose = require("mongoose")
var productsModel = {}

const Schema = mongoose.Schema

var productsSchema = new Schema({
    code: String,
    category: String,
    name: String,
    price: Number,
    specs: String,
    description: String,
    status:String
})

const MyModel = mongoose.model("products", productsSchema)


productsModel.saveProducts = function(post,callback){

    const instance = new MyModel
    instance.code = post.code
    instance.category = post.category
    instance.name = post.name
    instance.price = post.price
    instance.specs = post.specs
    instance.description = post.description
    instance.status = post.status

    instance.save().then((responseIdNumber) => {
        console.log(responseIdNumber);
        return callback({ state: true, message: "This register was saved successfully" })
    }).catch((error) => {
        return callback({ state: false, message: "Error while saving" + error })
    })

}

productsModel.toList = function(post, callback) {

    MyModel.find({}, {}).then((res) => {
        return callback(res)
    })
}

productsModel.toListFree = function(post, callback) {

    MyModel.find({ status: "1", category: post.category }, {}).then((res) => {
        return callback(res)
    })
}

productsModel.modify = function(post, callback) {
    
    MyModel.findByIdAndUpdate(post._id, {
        name:post.name,
        category:post.category,
        description:post.description,
        specs:post.specs,
        price:post.price,
        status:post.status
    }).then((res) => {
        console.log
        callback({state:true, message: "The register was updated" })
    }).catch((error) => {
        callback({state:false, message:"This register was not found in the database", error:error})
    })
}

productsModel.delete = function(post,callback){
    
    MyModel.findByIdAndDelete(post._id).then((res) => {
        callback({state:true, message:"This register has been deleted"})
    }).catch((error) => {
        callback({state:false, message:"This register does not exist", error: error})
    })
}

productsModel.toListId = function(post, callback) {

    MyModel.find({_id:post._id}, {}).then((res) => {
        return callback(res)
    })
}

productsModel.existentCode = function(post, callback){

    console.log(post)
    MyModel.find({code: post.code},{}).then((responseIdNumber) => {
        console.log(responseIdNumber.length)
        if(responseIdNumber.length == 0){
            return callback({ existent: "No"})
        } else {
            return callback({ existent: "Yes"})
        }
    })
}

module.exports.productsModel = productsModel