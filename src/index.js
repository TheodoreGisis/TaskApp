require("./db/mongoose")
const express = require('express')
const { default: mongoose } = require('mongoose')
const UserRoute = require('./routers/UserRouter')
const TaskRouter = require('./routers/TaskRouter')

const app = express()
const port = process.env.PORT 


app.use(express.json())
app.use(UserRoute)
app.use(TaskRouter)

app.listen(port, ()=>{
    console.log("Server is up on port " + port)
})
