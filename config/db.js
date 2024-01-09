const mongoose = require('mongoose');

const connectDatabase = async () => {

        await mongoose.connect("mongodb+srv://anishgehlot25:admin@cluster0.ywkepwd.mongodb.net/?retryWrites=true&w=majority");
        console.log("Connected to MongoDB");
  
}

module.exports = connectDatabase;
