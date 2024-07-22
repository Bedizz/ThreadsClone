import express from "express";
import { userSignUp, userLogin, logout,followUnfollowUser, updateUser,getUserProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const userRouter = express.Router();

userRouter.get("/profile/:query",getUserProfile)
userRouter.post("/signup",userSignUp)
userRouter.post("/login",userLogin)
userRouter.post("/logout",logout)
userRouter.post("/follow/:id",protectRoute,followUnfollowUser)
userRouter.put("/update/:id",protectRoute,updateUser)






export default userRouter;