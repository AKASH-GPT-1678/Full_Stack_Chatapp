import { Router } from "express";
const router = Router();
import vehicleVerification from "../controllers/vehicle.verification.js";
import { addToContactChatter ,acceptRequestChatter, checkForRequestChatter, getMyContactsChatter } from "../controllers/chatterbox.auth.js";

import { registerUser, loginUser, addToContact, addNickName, checkForRequest, acceptRequest, getMyContacts, loadMyProfile,deletUser, loadProfileDetails } from "../controllers/auth.controller.js";
import { createGroup, getUserGroups } from "../controllers/group.controller.js";


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addcontact", addToContact);
router.put("/addnickname", addNickName);
router.get("/checkrequest", checkForRequest);
router.put("/acceptrequest", acceptRequest);
router.get("/mycontacts", getMyContacts);
router.post("/verifyvehicle", vehicleVerification);
router.post("/delete", deletUser);
router.get("/profile", loadProfileDetails);
router.get("/myprofile", loadMyProfile);
router.post("/addcontactchatter", addToContactChatter);
router.put("/acceptrequestchatter", acceptRequestChatter);
router.get("/checkrequestchatter", checkForRequestChatter);
router.get("/mycontactschatter", getMyContactsChatter);
router.post("/creategroup", createGroup);
router.get("/my-groups", getUserGroups);

export default router;