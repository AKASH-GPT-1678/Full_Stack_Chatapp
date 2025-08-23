import { Router } from "express";
const router = Router();
import vehicleVerification from "../controllers/vehicle.verification.js";
import { addToContactChatter ,acceptRequestChatter, checkForRequestChatter, getMyContactsChatter ,checkandVerifyToken, loadMyProfile, checkUserStatus} from "../controllers/chatterbox.auth.js";
import { Upload } from "../configs/multer.config.js";
import { registerUser, loginUser, addToContact, addNickName, checkForRequest, acceptRequest, getMyContacts,deletUser, loadProfileDetails } from "../controllers/auth.controller.js";
import { createGroup, getUserGroups } from "../controllers/group.controller.js";
import { addProfileImage, saveProduct } from "../controllers/profile.controller.js";
import { registerGroup , getGroupsofUser  } from "../controllers/chatter.group.controller.js";


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
router.post("/addprofile" , Upload.single("profile") , saveProduct);
router.post("/registergroup", registerGroup);
router.get("/usergroups", getGroupsofUser);
router.get("/checktoken", checkandVerifyToken);
router.get("/userstatus/:userId", checkUserStatus);

export default router;