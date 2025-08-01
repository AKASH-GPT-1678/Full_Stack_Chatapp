import { Router } from "express";
const router = Router();
import vehicleVerification from "../controllers/vehicle.verification.js";

import { registerUser, loginUser, addToContact, addNickName, checkForRequest, acceptRequest, getMyContacts } from "../controllers/auth.controller.js";


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addcontact", addToContact);
router.put("/addnickname", addNickName);
router.get("/checkrequest", checkForRequest);
router.put("/acceptrequest", acceptRequest);
router.get("/mycontacts", getMyContacts);
router.post("/verifyvehicle", vehicleVerification);





export default router;