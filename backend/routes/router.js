import { Router } from "express";
const router = Router();

import { registerUser, loginUser, addToContact, addNickName, checkForRequest, acceptRequest } from "../controllers/auth.controller.js";


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addcontact", addToContact);
router.put("/addnickname", addNickName);
router.get("/checkrequest", checkForRequest);
router.put("/acceptrequest", acceptRequest);





export default router;