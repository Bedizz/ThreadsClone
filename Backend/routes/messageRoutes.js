import express from "express"
import { sendMessage,getMessages, getConversations } from "../controllers/messageController.js"
import {protectRoute} from "../middleware/protectRoute.js"

const messageRouter = express.Router()

messageRouter.get("/conversations",protectRoute,getConversations)
messageRouter.get("/:otherUserId",protectRoute,getMessages)
messageRouter.post("/",protectRoute,sendMessage)

export default messageRouter