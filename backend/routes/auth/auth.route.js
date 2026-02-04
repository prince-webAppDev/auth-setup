import express from "express"
import { registerUser, loginUser , logoutUser, saferoute } from "../../controllers/auth/auth.controller.js";
import { protect } from "../../middlewear/verify.middlewear.js"; 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); 
router.post("/protect", protect,  saferoute)

export default router;

