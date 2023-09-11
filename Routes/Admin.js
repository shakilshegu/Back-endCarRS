import { Router } from "express";
import { isAdminMiddleware } from "../Middleware/authMiddleware.js";
const router = Router();

import {
  adminSingUp,
  adminLogin,
  userList,
  userBlock,
  partnerList,
  addcategory,
  partnerBlock,
  getAdmininfobyid,
  getMessages,
  postmessege,
  getBooking,
  Verification,
  getTotalcount
} from "../Controllers/adminController.js";

router.get("/adminSingUp", adminSingUp);
router.post("/adminLogin", adminLogin);
router.get("/userList", userList);
router.get ("/getAdmininfobyid",isAdminMiddleware,getAdmininfobyid)
router.get("/userBlock", userBlock);
router.get("/Verification",Verification)
router.get("/partnerBlock",partnerBlock);
router.get("/partnerList", partnerList);
router.post("/addcategory",addcategory)
router.get("/getMessages",getMessages)
router.post("/postmessege",postmessege)
router.get("/getBooking",getBooking)
router.get("/getTotalcount",getTotalcount)


export default router;
