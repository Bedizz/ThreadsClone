import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { getRecipientSocketId, io } from '../socket/socket.js';
import {v2 as cloudinary} from "cloudinary";


export const sendMessage = async(req,res) => {
    // get the recipientId and message from the request body
    const {recipientId,message} = req.body;
    //get the image from the request body if it exists
    let {image} = req.body;
    // get the senderId from the request
    const senderId = req.user._id
    try {
        // find the conversation between the sender and the recipient
        let conversation = await Conversation.findOne({
            // the participants field is an array that contains the senderId and the recipientId
            participants: {$all: [senderId,recipientId]}
        })
        // if the conversation does not exist between the sender and the recipient, create a new conversation
        if(!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
            // save the conversation
            await conversation.save()
        }
        //here we need to check if the image exists and if it does we need to upload it to cloudinary
        if(image) {
            const uploadedResponse = await cloudinary.uploader.upload(image)
            image = uploadedResponse.secure_url
        }
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            image: image || ""
        })
        //here we need to save the message and update the last message because we will use the last message to display the last message in the conversation
        await Promise.all([
            //Promise.all is faster way and happening concurrently
            newMessage.save(),
            // 
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
        ])
        // get the recipient socket (second step)
        const recipientSocketId = getRecipientSocketId(recipientId)
        //here "to" is to get the event for one user
        if(recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage",newMessage)
            //be carefull about the event name, it should be the same as the one in the front end
        }

        res.status(200).json(newMessage)
        
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}

export const getMessages = async (req,res) => {
    const {otherUserId} = req.params;
    const userId = req.user._id;
    try {
        const conversation = await Conversation.findOne({
            participants:{$all:[userId,otherUserId]}
        })
        if(!conversation) { 
            return res.status(404).json({message:"conversation not found"})
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({createdAt: 1})
        if(!messages) {
            return res.status(500).json({message:error.message})
        }

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}
export const getConversations = async (req,res) => {
    const userId = req.user._id;
    try {
        const conversations = await Conversation.find({participants: userId}).populate({
            path:"participants",
            select:"username profilePic"
        })
        // remove the current user form the participants array
        conversations.forEach(conversation => {
            conversation.participants = conversation.participants.filter( (participant) => 
                participant._id.toString() !== userId.toString())
            })
            
        res.status(200).json(conversations)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}