var express = require("express")
global.app = express()
var bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
const mongoose = require("mongoose");
global.nodeMailer = require("nodemailer")
global.config = require("./config.js").config
global.sha256 = require("sha256")
global.multer = require("multer")
global.path = require("path")


app.all('*', function(req, res, next) {

    var whitelist = req.headers.origin;
    res.header('Access-Control-Allow-Origin', whitelist);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', " authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Credentials", "true");
    // res.header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');

    next();
});


var cors = require("cors")

app.use(cors({
    origin: function(origin, callback){
        console.log(origin)
        if(!origin){
            return callback(null,true)
        }
        if(config.whiteList.indexOf(origin) === -1){
            return callback("CORS error", false)
        }
        return callback(null, true)
    }
}))

const MongoStore = require("connect-mongo")
var session = require("express-session")({
    secret:config.secretSession,
    resave:true,
    saveUninitialized:true,
    cookie:{ path:"/", httpOnly:true, maxAge: config.sessionTime },
    name: config.cookieName,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/EcommerceCookie"})
})
app.use(session)



require("./routes.js")

mongoose.connect("mongodb://127.0.0.1:27017/" + config.bd,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then ((response) => {
    console.log("Connected to mongo successfully")
}).catch((error) => {
    console.log(error)
})



app.use("/", express.static(__dirname + "/Site Frontend")) // Previous to dirname is a double underscore
app.use("/products", express.static(__dirname + "/products"))
app.use("/usersAvatar", express.static(__dirname + "/usersAvatar"))


app.listen(config.port, function(){
    console.log("Server is working on port " + config.port)
})