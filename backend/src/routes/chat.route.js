import express from "express";
import { protectRoute } from "../middleware/auth.middleware";

const router=express.router;
router.get("/token",protectRoute,getStreamToken);
export default router;