const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors  = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail =   require('../utils/sendEmail')
const crypto = require("crypto");


exports.registerUser = catchAsyncErrors(async (req, res, next) => {
   console.log(req.body)
    const {name, email, password ,role} = req.body;

    const user =  await User.create({
        name, email, password,role,
        
    })
    sendToken(user, 201 , res)
});

exports.loginUser = catchAsyncErrors(async  (req, res, next) => { 

    const {email, password} = req.body

    if(!email || !password) {
        return next(new ErrorHandler("Please enter email and password"));
    }

    const user =  await User.findOne({email}).select("+password");

    if(!user) { 
        return next(new ErrorHandler("Invalid email and password"));

    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) { 
        return next(new ErrorHandler("Invalid email and password",401));

    }
    sendToken(user, 200 , res)
})

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token" , null , {
        expire: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "logged out"
    })
})


exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user =  await User.findOne({email}).select("+password");

    if(!user) { 
        return next(new ErrorHandler("User not found " , 404));

    }

    // get reset password token

    const resetToken = user.getPasswordToken();

    await User.save({validateBeforeSave: false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/v1/password/reset/${resetToken}`

    const message = `Password reset tokn is :- ${resetPasswordUrl}`
    
    try {
         await sendEmail({
           email: user.email,
           subject: "Password reset",
           message
         })

        res.status(200).json({
            success: true,
            message: "Email is successfully send"
        })
    }catch(err) {
      this.resetPasswordToken = undefined;
      this.resetPasswordExpire = undefined;

      await User.save({validateBeforeSave: false})

      return next(new ErrorHandler(err.message, 500))

    }
   
})

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if(!user)  {
        return next(new ErrorHandler("rest password token is invalid",400))
    }
    if(res.body.password !== req.body.confirmPassword) {   
        return next(new ErrorHandler("Password does not match",400))
    }
    user.password = req.body.password;
    this.resetPasswordToken = undefined;
    this.resetPasswordExpire = undefined;

    await user.save()

    sentToken(user , 200 ,res)

});

exports.getUserDetail = catchAsyncErrors(async (req, res , next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });

})

exports.updatePassword = catchAsyncErrors(async (req, res ,next) => {
    const user = await User.findById(req.user.id).select('+password');
    
    const isPasswordMatched = await  user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched) { 
        return next(new ErrorHandler("Invalid email and password",400));

    }

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match ",400));

    }

    user.password = req.body.newPassword;
    await  user.save()
    
    sendToken(user , 200 , res)
  
next()
})


exports.updateProfie = catchAsyncErrors(async (req, res ,next) => {

    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    }
    
    const user = await User.findByIdAndUpdate(req.user.id , newUserData , {
        new: true,
        reunValidators: true,
        useFindAndModify: false,
    });
    
    res.status(200).json({
       success: true, 
    })
    next()
})

exports.getAllUser = catchAsyncErrors(async (req, res ,next) => {
    const users = await User.find({});

    res.status(200).json({
         success: true,
         users
    })
 
    next()
})

// get single user details for admin
exports.getSingleUser = catchAsyncErrors(async (req, res ,next) => {

    const user = await User.findById(req.params.id);


    if(!user) {
        return next(new ErrorHandler("user does not exist" , 404))
    }
    res.status(200).json({
         success: true,
         user
    })
 
    next()
})


//update user role 

exports.updateUserRole = catchAsyncErrors(async (req, res ,next) => {

    const newuserData = {
        name : req.body.name,
        email : req.body.email,
        role: req.body.role
    }
    
    const user = await User.findByIdAndUpdate(req.params.id , newuserData , {
        new: true,
        reunValidators: true,
        useFindAndModify: false,
    });
    
    res.status(200).json({
       success: true, 
       user
    })
    next()
})

exports.getAllUser = catchAsyncErrors(async (req, res ,next) => {
    const users = await User.find({});

    res.status(200).json({
         success: true,
         users
    })
 
    next()
})

// Delete user -admin
exports.deleteUser = catchAsyncErrors(async (req, res ,next) => {

    
    
    const user = await User.findById(req.user.id , newuserData , {
        new: true,
        reunValidators: true,
        useFindAndModify: false,
    });
    
    if(!user) {
        return next(new ErrorHandler("user does not exist" , 404))
    }

    await user.remove()
    
    res.status(200).json({
       success: true, 
    })
    next()
})
