import { Router } from "express";
const router = Router();

import { registerUser , loginUser , addToContact , addNickName } from "../controllers/auth.controller.js";


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addcontact", addToContact);
router.put("/addnickname", addNickName);





export default router;