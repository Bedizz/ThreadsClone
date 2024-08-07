import express from "express";
import { userSignUp, userLogin, logout,followUnfollowUser, updateUser,getUserProfile,getSuggestedUsers,freezeAccount } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const userRouter = express.Router();

userRouter.get("/profile/:query",getUserProfile)
userRouter.get("/suggested", protectRoute,getSuggestedUsers)
userRouter.post("/signup",userSignUp)
userRouter.post("/login",userLogin)
userRouter.post("/logout",logout)
userRouter.post("/follow/:id",protectRoute,followUnfollowUser)
userRouter.put("/update/:id",protectRoute,updateUser)
userRouter.put("/freeze",protectRoute,freezeAccount)







export default userRouter;