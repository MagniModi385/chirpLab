import express from "express";
import { signup,login,logout,onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router=express.Router();
router.post('/signup',signup);
router.post('/login',login);
//post for logout because post changes the server state so logging out will destroy the session
router.post('/logout',logout);
router.post('/onboarding',protectRoute,onboard);
//check if user is logged in 
router.get("/me",protectRoute,(req,res)=>
    {
        res.status(200).json({success:true,user:req.user});
    })
export default router;