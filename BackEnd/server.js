import path from "path";
import dotenv from "dotenv";
import express from "express";
import {connectDB} from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import {v2 as cloudinary} from "cloudinary";
import messageRouter from "./routes/messageRoutes.js"
import {app,server} from "./socket/socket.js";


// in order to use the .env file, we need to use the config method
dotenv.config();

connectDB();
// in order to create a server, we need to use the express method
// const app = express(); we dont need it here anymore because we are using express in socket.js

// this is the dynamic port that will be used to run the server
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// this is the cloudinary configuration that will be used to upload the image to the cloudinary server
cloudinary.config({
    cloud_name: process.env.CLODUINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

})

app.use(express.json({limit: "50mb"})); // this limit is used to increase the size of the image that can be uploaded because it gave an error when the overload was too large

// this is the middleware that will be used to parse the form data in the incoming data(req.body)
app.use(express.urlencoded({ extended: true }));

// this is the middleware that will be used to get the cookie from the incoming data(req.cookies) and set it in the outgoing data(res.cookie)
app.use(cookieParser())

// Routes 
app.use("/api/users", userRouter)
app.use("/api/posts",postRouter)
app.use("/api/messages",messageRouter)



// this is the way to use both sides of the application in the same port



if (process.env.NODE_ENV.trim() === "production") {
	app.use(express.static(path.join(__dirname, "/FrontEnd/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "FrontEnd", "dist", "index.html"));
	});
} 


// this is the route that will be used to get the data from the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}/`);
// })

// after implementing socket io, we need to use the server.listen method instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);

    
})
