const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = mongoose.Schema({
    name: {
        type:String,
        required: [true , "Please enter your name"],
        maxLength:[30 , "Name must be at least 30 characters"],
        minLength:[4 , "Name must have  more than 4 letters"]
    },
    email :{
        type:String,
        required: [true , "Please enter your email"],
       unique: true,
        validate: [validator.isEmail, "Please enter a valid email"] 
    },
    password :{
        type:String,
        required: [true , "Please enter your password"],
        select: false,
    },
     role: {
        type:String,
        default: "admin",
    },
    avatar: {
        public_id: {
            type:String,
        },
        url: {
            type:String,
        }
    },
   

    resetPasswordToken : String,
    resetPasswordExpire : Date,


}
)

userSchema.pre("save", async function(next) {


  if(!this.isModified("password")) {
     next();
  }

    this.password= await bcrypt.hash(this.password , 10)
})

userSchema.methods.getJWTToken = function() {
  return jwt.sign({id: this._id}, "fdgdfgdfgfdg", {
    expiresIn : "5d"
  }) 
}

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await  bcrypt.compare(enteredPassword, this.password);
  }
  


userSchema.methods.getResetPassword = function() {
  
    const resetToken = crypto.randomBytes(20).toString("hex");
   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
   this.resetPasswordToken = Date.now() + 15*60*1000;

   return resetToken;
}

module.exports = mongoose.model("User" , userSchema);
