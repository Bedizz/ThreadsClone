import express from "express";
import { createPost,deletePost,getPost,getFeedPosts,likeUnlikePost,replyToPost,deletePostReply,getUserPosts } from "../controllers/postController.js";
import { protectRoute } from "../middleware/protectRoute.js";


const postRouter = express.Router();


postRouter.get("/feeds",protectRoute, getFeedPosts)
postRouter.get("/:id", getPost)
postRouter.get("/user/:username", getUserPosts)
postRouter.post("/create", protectRoute, createPost)
postRouter.delete("/:id", protectRoute, deletePost)
postRouter.put("/like/:id", protectRoute, likeUnlikePost)
postRouter.put("/reply/:id", protectRoute, replyToPost)
postRouter.delete("/reply/:id", protectRoute, deletePostReply)






export default postRouter;