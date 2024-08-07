import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

// we are using express to create a server so we don't need another express in server.js (deleted it)
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// here we pass the userId and in return we get the socket id of the user
export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

//this is the map that will be used to store the socket id of the user (first step for listening the messages)
const userSocketMap = {}; // userId : socketId

//this is the function which listens to the connection event
io.on("connection", (socket) => {
  //this will log the socket id of the user who is connected
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      // await Message.updateMany({conversationId, sender: userId}, {seen: true}) // this will mark the messages as seen (recommended by copilot)
      await Message.updateMany(
        { conversationId:conversationId , seen: false },
        { $set: { seen: true } });
    await Conversation.updateOne({_id: conversationId}, {$set:{ "lastMessage.seen" :true}}); //this will mark all the messages as seen
      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  //this will log the socket id of the user who is disconnected
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
