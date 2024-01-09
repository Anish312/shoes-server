const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors  = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');



exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });

});
 
exports.getAllProducts = async (req, res) => {

  
    const resultPerPage = 6;
    const productCount =  await Product.countDocuments
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage); 

    const products = await apiFeature.query; // Access the query property to retrieve the products
    
    res.status(200).json(
      {  success: true,
        products,
        productCount,
        resultPerPage
    }     

        );
};

exports.updateProduct = catchAsyncErrors ( async (req, res) => {

    let product = await Product.findById(req.params.id)
    
    if(!product) {
        res.status(500).json({
            success: false,
            message: "Product not found"
        });
    } 
    product = await Product.findByIdAndUpdate(req.params.id , req.body , {
        new: true,
        runValidation: true,
        useFindAndModify: false,
    })
    res.status(200).json({success: true, product})
}
)

exports.getProductDetails =catchAsyncErrors ( async (req, res ,next) => {

    const product = await Product.findById(req.params.id )

    if(!product) {
        return next(new ErrorHandler("product not found" , 404))
    }
    
    res.status(200).json(
        {
            success: true,
            product
        }
    )
}
)

exports.deleteProduct =catchAsyncErrors ( async (req, res ,next) => {

    const product = await Product.findById(req.params.id )

    if(!product) {
        return next(new ErrorHandler("product not found" , 404))
    } 

    await product.remove()
    
    res.status(200).json(
        {
            success: true,
            message: "deleted successfuly"
        }
    )
}
)

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;   
     console.log( req.user)

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);


    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        // Update the existing review
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        // Add a new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0 ;


    product.ratings= product.reviews.forEach(rev=> {
        avg+= rev.rating
    })/product.reviews.length

    await product.save({validateBeforeSave: false})
 
    res.status(200).json({
        success: true,
        
    });
});



// get all reviews of a product

exports.getAllReviews= catchAsyncErrors(async (req, res, next) => {
   const product =  await Product.findById(req.query.id);

   if(!product) {
    return next(new ErrorHandler("product not found" , 404))
}
res.status(200).json({
    success: true,
    reviews: product.reviews
});


})

// delete the review
exports.deleteReview= catchAsyncErrors(async (req, res, next) => {
    const product =  await Product.findById(req.query.id);
 
    if(!product) {
     return next(new ErrorHandler("product not found" , 404))
    }

    const reviews =  product.reviews.filter(review => review.id().toString()!== req.query.id.toString())
    res.status(200).json({
        success: true,
  
    });
    
    let avg = 0 ;


    reviews.forEach(rev=> {
        avg+= rev.rating
    })

    const ratings = avg / reviews.length

    const numOfReviews = reviews.length;

    await Product.findIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews,
    } , {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

 })