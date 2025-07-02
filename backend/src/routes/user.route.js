import express from "express";
import { 
    getMyFriends,
    getRecommendedUsers,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequest,
    getOutgoingFriendReqs} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router=express();
//apply auth.middleware to all routes
router.use(protectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.get("/friend-requests",getFriendRequest);
router.get("/outgoing-friend-requests",getOutgoingFriendReqs); 
export default router;