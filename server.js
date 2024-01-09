const app = require('./app');
const connectDatabase = require('./config/db');


process.on('uncaughtException', (err) => {
    console.log("error: " + err.message)
    console.log("shutting down the server due to uncaught exception ")
    process.exit(1);
})

connectDatabase();


//route imnpprt 
// const product = require("./routes/productRoute")

// app.use("/api/v1",product)
const server = app.listen(4000, () => {
    console.log("listening on port " + 4000)
})

process.on("unhandledRejection" ,err => {
    console.log("error: " + err)
    console.log("shutting down the server")

    server.close(()=> {
        process.exit(1);
    })
})