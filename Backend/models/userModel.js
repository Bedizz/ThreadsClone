import mongoose from "mongoose";

const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match : emailRegex
    },
    password: {
        type: String,
        minLength: 6,
        required: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    bio:{
        type: String,
        default: ""
    },
    isFrozen : {
        type: Boolean,
        default: false
    },
    
}, {
    timestamps: true

});

const User = mongoose.model("User", userSchema);

export default User;