const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const cors=require('cors')

// variables
const app=express()
const {PORT,DB_NAME,DB_PASS,DB_USER}=process.env
const port=PORT || 8000


// middlewares
app.use(express.json())
app.use(cors())
app.use("/images",express.static("assets/images"))
app.use("/",express.static("public"))



// db connection
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@umesh.hybg3.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,(err)=>{
    if(err) return console.log(err.message)
    console.log('db connected')
})

// routes
app.use("/api/admin/admin-user",require('./routes/user.routes'))
app.use("/api/admin/category",require('./routes/category.routes'))
app.use("/api/admin/product",require('./routes/product.routes'))
app.use("/api/front",require('./routes/front.routes'))


// server setup
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
