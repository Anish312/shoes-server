const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required : [true , "Please enter the name"]
        
    },
    description: {
        type: String,
        required : [true , "Please enter the description"]
    },


    price: {
        type: Number,
        required: [true , "Please enter the price"]
    },
    ratings: {
        type: Number,
        required : [true , "Please enter the rating"]
    },
    image: [
           
        
        {color: {
            type: String,
            required: true,
          },
        public_id : {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
    ],

  sizes: [
        {
            size: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1 // Default quantity for the size
            }
        }
    ],
     

    category : {
        type: String,
        required : [true , "Please enter the category"]
    },
    subCategory : {
        type: String,
        required : [true , "Please enter the SubCategory"]
    },
  
    numOfReviews: {
        type: Number,
        default:0
    },
    reviews: [
        {
            user: {
                type : mongoose.Schema.ObjectId,
                ref : "User",
                required: true
            },
            name:{
                type: String,
                required: true
            },
            rating : {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required: true
    },
    createdAt : {
      type: Date,
      default : new Date 
    }
})

module.exports = new mongoose.model('Product', productSchema); 