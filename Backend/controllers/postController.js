import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from "cloudinary";

export const createPost = async (req, res) => {
  //get the user information from the request body
  const { postedBy, text } = req.body;
  let { img } = req.body;
  try {
    //check the required fields
    if (!postedBy || !text) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    //check that user exists
    const user = await User.findById(postedBy);
    if (!user) return res.status(400).json({ error: "User does not exist" });
    //prevent user from creating a post for another user
    if (user._id.toString() !== req.user._id.toString())
      return res.status(400).json({ error: "User not authorized" });
    const maxLength = 500;
    //check the length of the text
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }
    if(img) {
      const uploadedResponse = await cloudinary.uploader.upload(img)
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      postedBy,
      text,
      img,
    });
    //save the new post
    await newPost.save();
    //check if the post was created
    if (!newPost) {
      return res.status(400).json({ error: "Post could not be created" });
    }

    res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const deletePost = async (req, res) => {
  //get the post id from the request parameters
  const { id } = req.params;
  try {
    //check if the post exists
    const post = await Post.findById(id);
    if (!post) return res.status(400).json({ message: "Post does not exist" });
    //check if the user is authorized to delete the post
    if (post.postedBy.toString() !== req.user._id.toString())
      return res.status(400).json({ message: "User not authorized" });
    //if the post has an image, delete the image from cloudinary
    if(post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    //delete the post
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getPost = async (req, res) => {
    //get the post id from the request parameters
  const { id } = req.params;
  try {
    //find the post by id
    const post = await Post.findById(id);
    //check if the post exists
    if (!post) return res.status(400).json({ message: "Post does not exist" });
    //return the post
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const user =await User.findById(userId);
    if(!user) return res.status(400).json({message: "User does not exist"});
    const following = user.following;
    //get all posts from users that the current user is following
    const feedPosts = await Post.find({ postedBy: { $in: [userId, ...following] } }).sort({ createdAt: -1 });
    
    //return the posts
    res.status(200).json(feedPosts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getUserPosts = async (req, res) => {
  const {username} = req.params;
  try {
    const user = await User.findOne({username});
    if(!user) return res.status(400).json({message: "User does not exist"});
    const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1});
    res.status(200).json(posts);
    
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}


export const likeUnlikePost = async (req, res) => {
    //get the post id from the request parameters and rename it to postId
    const { id:postId } = req.params;
    //get the user id from the request
    const userId = req.user._id;
    try {
        //find the post by id
        const post = await Post.findById(postId);
        if(!post) return res.status(400).json({message: "Post does not exist"});
        //check if the user has already liked the post
        const isLiked = post.likes.includes(userId);
        if(isLiked){
            //unlike the post
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            res.status(200).json({message: "Post unliked"});
            // -------------------------------2nd way----------------
            // post.likes = post.likes.filter(id => id.toString() !== userId.toString());
            // -----------------------------------------------
        }else {
            //like the post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: "Post liked"});
        }
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const replyToPost = async (req, res) => {
    const postId = req.params.id;
    const {text} = req.body;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;
    try {
        if(!text) return res.status(400).json({message: "Please fill in all fields"});
        const post = await Post.findById(postId);
        if(!post) return res.status(400).json({message: "Post does not exist"});
        const maxLength = 500;
        if(text.length > maxLength) return res.status(400).json({message: `Text must be less than ${maxLength} characters`});
        const reply = {
            replier: userId,
            text,
            userProfilePic,
            username
        }
        post.replies.push(reply);
        await post.save();
        res.status(200).json(reply);
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const deletePostReply = async (req, res) => {
    //get the post id from the request parameters
    const postId = req.params.id;
    //get the reply id from the request body
    const {replyId} = req.body;
    //get the user id from the request
    const userId = req.user._id;
    try {
        //find the post by id
        const post = await Post.findById(postId);
        //check if the post exists
        if(!post) return res.status(400).json({message: "Post does not exist"});
        //check if the reply exists
        const reply = post.replies.find(reply => reply._id.toString() === replyId);
        //check if the reply exists
        if(!reply) return res.status(400).json({message: "Reply does not exist"});
        //check if the user is authorized to delete the reply
        // if (reply.replier.toString() !== userId && post.createdBy.toString() !== userId) {
        //     return res.status(403).json({ message: "User not authorized" });
        // }

        post.replies = post.replies.filter(reply => reply._id.toString() !== replyId);
        await post.save();
        res.status(200).json({message: "Reply deleted", post});

        
    
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt: -1});
    res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}