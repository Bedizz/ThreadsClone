import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenandCookie } from "../utils/helpers/generateTokenandCookie.js";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";

export const userSignUp = async (req, res) => {
  //get the user information from the request body
  const { name, email, password, username } = req.body;
  try {
    //find the user by email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      res.status(400).json({ error: "User already exists" });
    }
    //decide hashing criteria
    const salt = await bcrypt.genSalt(10);
    //hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    //create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    //save the new user
    await newUser.save();
    //check if the user was created
    if (!newUser) {
      res.status(400).json({ error: "User could not be created" });
    }
    //generate token and cookie
    generateTokenandCookie(newUser._id, res);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const userLogin = async (req, res) => {
  //get the user information from the request body
  const { email, username ,password} = req.body;
    try {
      //find the user by email or username
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            return res.status(400).json({error: "User does not exist"})
        }
        //check if the password is correct
        const isMatch = await bcrypt.compare(password, user?.password);
        if (!isMatch) {
           return res.status(400).json({error: "Invalid username or password"})
        }
        //generate token and cookie
        const cookie = generateTokenandCookie(user._id, res);
        return res.status(200).json(user)

        
    } catch (error) {
       return res.status(500).json({error: error.message})    
    }
}

export const logout = async (req, res) => {
  try {
    //clear the cookie
    res.clearCookie("jwt");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export const followUnfollowUser = async (req, res) => {
  try {
    //get the id of the user to follow/unfollow from the request parameters
    const { id } = req.params;
    //find the user to follow/unfollow by id
    const userToFollow = await User.findById(id);
    //check if the user exists
    if (!userToFollow) {
      return res.status(404).json({ error: "UserToFollow not found" });
    }
    //find the user following/unfollowing
    const followingUser = await User.findById(req.user._id);
    //check if the user exists
    if (!followingUser) {
      return res.status(404).json({ error: "FollowingUser not found" });
    }
    //check if the user is trying to follow/unfollow themselves
    if(userToFollow._id.toString() === followingUser._id.toString()){
      return res.status(400).json({error: "You can't follow/unfollow yourself"})
    }
    // -----2nd option---
    // if(id === req.user._id.toString()){
    //   return res.status(400).json({message: "You can't follow yourself"})
    // }
    // ------------------

    //check if the user is already following/unfollowing the user
    const isFollowing = followingUser.following.includes(id);
    //if the user is already following/unfollowing the user
    if (isFollowing) {
      //unfollow user
      await followingUser.updateOne({ $pull: { following: id } });
      await userToFollow.updateOne({ $pull: { followers: req.user._id } });
      return res.status(200).json({ message: "User unfollowed successfully" });
      //or 
      // await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      // await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
    } else {
      //follow user
      await followingUser.updateOne({ $push: { following: id } });
      await userToFollow.updateOne({ $push: { followers: req.user._id } });
      return res.status(200).json({ message: "User followed successfully" });
      //or 
      // await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      // await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });   
  }
}

export const updateUser = async (req, res) => {
  //get the user information from the request body
  const { email, username, bio, password } = req.body;
  let { profilePic } = req.body;
  //get the user id from the request object
  const userId = req.user._id;
  try {
    //find the user by id
    let user = await User.findById(userId);
    //check if the user exists
    if (!user) return res.status(400).json({error: "User not found"});
    //if user sends a new password
    if(req.params.id !== userId.toString()) return res.status(401).json({error: "You can only update your account"})
    if(password){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      return res.status(200).json({message: "Password updated successfully"});
    }
    if(profilePic) {
      if(user.profilePic){
        await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic)
      profilePic = uploadedResponse.secure_url;
    }
    //update the user information
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;
// save the updated user information
    user = await user.save();
    // find all the posts by the user and update the username and profilePic
     await Post.updateMany(
      {"replies.replier" : userId},
      {
        $set: {
        "replies.$[reply].username": user.username,
        "replies.$[reply].profilePic": user.profilePic
        },
      },
        {arrayFilters: [{"reply.replier": userId}] } 

     )
     user.password = null;
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  //get the username or id from the request parameters
  const { query } = req.params;
  try {
    let user;
    if(mongoose.Types.ObjectId.isValid(query)){
      //find the user by id
       user = await User.findOne({ _id:query }).select("-password").select("-email");
    //find the user by username
    } else {
      user = await User.findOne({ username:query }).select("-password").select("-email");  
    }
    //check if the user exists
    if (!user) return res.status(404).json({ error: "User not found" });
    //send the user information
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};