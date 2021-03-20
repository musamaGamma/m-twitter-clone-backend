const express = require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
// const cors = require("cors")


const app = express()

//setting up database
mongoose.connect(process.env.MONGO_URI, {useCreateIndex: true, useNewUrlParser:true, useUnifiedTopology :true})
.then(()=> console.log("connected to database"))
.catch(err => console.log(err.message))

//middlewares
// app.use(cors("https://m-twitter-clone.vercel.app"))
app.use(express.json({limit: "10mb"}))
app.use(morgan("dev"))

//api endpoints

    app.get("/", (req, res) => {
      res.send("api is running");
    });


app.use("/api", require("./routes/tweetRoute"))
app.use("/api", require("./routes/usersRoute"))
app.use("/login", require("./routes/loginRoute"))
// app.use("/profile", require("./routes/profileRoute"))


const port = process.env.PORT || 5000
app.listen(port, ()=> console.log("listening on port " + port))