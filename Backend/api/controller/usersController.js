
var usersModel = require("../models/usersModel.js").usersModel

var usersController = {}

usersController.saveUsers = function(request, response) {

    try {
        var post = {
            name: request.body.name,
            lastName: request.body.lastName,
            email: request.body.email,
            password: request.body.password
        }    
        
        if(post.name == undefined || post.name == null || post.name == ""){
            response.json({state:false, message:"name field is mandatory"})
            return false
        }

        if(post.lastName == undefined || post.lastName == null || post.lastName == ""){
            response.json({state:false, message:"Last Name field is mandatory"})
            return false
        }

        if(post.email == undefined || post.email == null || post.email == ""){
            response.json({state:false, message:"Email field is mandatory"})
            return false
        }

        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(post.email) == false) {
            console.log({ state: false, message: "This email is not valid" })
            return false
        }

        if(post.password == undefined || post.password == null || post.password == ""){
            response.json({state:false, message:"Password field is mandatory"})
            return false
        }

        if(post.password.length > 12){
            response.json({state:false, message:"Password cannot be more than 12 characters long"})
            return false
        }

        if(post.password.length < 5){
            response.json({state:false, message:"Password cannot be less than 5 characters long"})
            return false
        }

        post.password = sha256(post.password + config.secretEncrypt)
        
        usersModel.existentEmail(post, function(responseIdNumber){

            if (responseIdNumber.existent == "No") {

                post.myCode = "AC" + Math.floor(Math.random() * (99999 - 10000) + 10000)

                usersModel.saveUsers(post, function(responseModel){
                    if(responseModel.state == true){

                        // Here is were the email to confirm code is sent using nodemailer
                        var nodeMailer = require("nodemailer")
                        var transporter = nodeMailer.createTransport({
                            host: "smtp.gmail.com", // for outlook is: smtp.live.com
                            port: 587,
                            requireTLS: true,
                            secure: false,
                            auth: {
                                user: config.userGmail,
                                pass: config.passGmail
                            }
                        })

                        var mailOptions = {
                            from: config.userGmail,
                            to: post.email,
                            subject: "Verify your account",
                            html: `<div style="font-family: Arial, sans-serif;line-height: 1.6;background-color: #4CAF50;margin: 0;padding: 42px;">

                                        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                            <h1 style="font-size: 24px; color: #333333; margin-bottom: 20px;">Activación de cuenta</h1>
                                            <p>Hi!</p>
                                            <p>Thank you for signing up on Altitud. To activate your account click on the following link:</p>
                                            <p><a style="display: inline-block; padding: 10px 20px; background-color: #337ab7; color: #ffffff; text-decoration: none; border-radius: 3px;" href="http://localhost:4200/activateAccount/${post.email}/${post.myCode}">Activate account ${post.myCode}</a></p>
                                            <p>If the link does not work please copy and paste the following link on your browser:</p>
                                            <p>http://localhost:4200/activateAccount/${post.email}/${post.myCode}</p>
                                            <p>If you have not created an account on our Altitud please disregard this email.</p>
                                            <p>Cheers!</p>
                                            <p>Altitud team</p>
                                        </div>
                                
                                    </div>`
                        }

                        transporter.sendMail(mailOptions, (error, info) => {
                            if(error){
                                console.log(error)
                                response.json(error)
                            } else{
                                response.json({state: true, message:"The user was created successfully! Check your mailbox"})
                            }
                        })

                    } else{
                        response.json(responseModel)
                    }

                })                
            } else {
                response.json({ state: false, message: "This email already exists, try another one"})
            }
        })        
        
    } catch (error) {
        response.json({ state: false, message: "Unexpected error", error:error })
    }
}

usersController.toList = function(request, response) {
    usersModel.toList(null,function(responseModel){
        response.json(responseModel)
    })
}

usersController.modify = function(request, response) {
    
    var post = {
        _id:request.body._id,
        name:request.body.name,
        lastName:request.body.lastName,
        role:request.body.role
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"_id field is mandatory"})
        return false
    }

    if(post.name == undefined || post.name == null || post.name == ""){
        response.json({state:false, message:"name field is mandatory"})
        return false
    }

    if(post.lastName == undefined || post.lastName == null || post.lastName == ""){
        response.json({state:false, message:"Last Name field is mandatory"})
        return false
    }

    if(post.role == undefined || post.role == null || post.role == ""){
        response.json({state:false, message:"role field is mandatory"})
        return false
    }

    usersModel.modify(post, function(responseModel) {
        response.json(responseModel)
    })
    
}

usersController.delete = function(request, response) {
    var post = {
        _id:request.body._id
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"_id field is mandatory"})
        return false
    }   
    
    usersModel.delete(post,function(responseModel){
        response.json(responseModel)
    })
}

usersController.toListId = function(request, response) {

    var post = {
        _id:request.body._id
    }

    if(post._id == undefined || post._id == null || post._id == ""){
        response.json({state:false, message:"Id field is mandatory"})
        return false
    }   

    usersModel.toListId(post,function(responseModel){
        response.json(responseModel)
    })
}

usersController.login = function(request, response) {

    var post = {
        email: request.body.email,
        password: request.body.password
    }

    if(post.email == undefined || post.email == null || post.email == ""){
        response.json({state:false, message:"email field is mandatory"})
        return false
    }  
    
    if(post.password == undefined || post.password == null || post.password == ""){
        response.json({state:false, message:"password field is mandatory"})
        return false
    }  

    post.password = sha256(post.password + config.secretEncrypt)

    usersModel.activeEmail(post, function(status){
        if(status.state == false){
            response.json({state:false, message:"This email is not valid"})
            return false
        } else{
            if(status.res[0].status == 0){
                response.json({state:false, message:"This account is not active yet"})
                return false
            } else{
                usersModel.login(post,function(responseModel){
                    if(responseModel.state == true){
                        
                        request.session._id = responseModel.res[0]._id
                        request.session.name = responseModel.res[0].name
                        request.session.lastName = responseModel.res[0].lastName
                        request.session.role = responseModel.res[0].role

                        response.json({state:true, message: "Welcome " + responseModel.res[0].name})
                    } else{
                        response.json({state:false, message: "Your credentials are not valid"})
                    }
                })
            }
        }
    })
}

usersController.activateAccount = function(request, response) {
    var post = {
        email: request.body.email,
        code: request.body.code
    }

    if(post.email == undefined || post.email == null || post.email == ""){
        response.json({state:false, message:"email field is mandatory"})
        return false
    }

    if(post.code == undefined || post.code == null || post.code == ""){
        response.json({state:false, message:"Code field is mandatory"})
        return false
    }

    usersModel.searchActivationCode(post, function(responseModel){
        if(responseModel.state == false){
            console.log({state:false, message:"The email or code is invalid"})
            response.json({state:false, message:"The email or code is invalid"})
            return false
        } else{
            console.log(responseModel)
            if(responseModel.status == 1){
                // response.json({state:true, message:"Your account has been activated already"})
                response.json({state: true, message:"Your account has been activated already"})
            } else{
                usersModel.changeStatus(post, function(responseStatus){
                    if(responseStatus.state == true){
                        response.json({state: true, message:"Your account has just been activated! You can now log in"})
                    } else {
                        response.json({state: false, message:"There was an error activating your account"})
                    }
                })
            }
        }
    })


}

usersController.uploadFile = function(request, response) {

    var post = {
        name: request.session._id
    }

    if(request.session._id == undefined || request.session._id == null || request.session._id == ""){
        response.json({state:false, message:"Please log in"})
        return false
    }

    const storage = multer.diskStorage({
        destination:(request,file, cb) => { // cb = callback
            cb(null,"usersAvatar/")
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


module.exports.usersController = usersController