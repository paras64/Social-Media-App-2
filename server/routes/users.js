import express from "express";
import { getUser , getUsersFriends , addRemoveFriend } from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

// Read Routes
router.get("/:id" , verifyToken , getUser);
router.get("users/:id/friends" , verifyToken , getUsersFriends);

// update Routes
router.patch("/users/:id/:friendId", verifyToken,addRemoveFriend);


export default router;
