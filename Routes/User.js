import { Router } from "express";
import upload from "../Middleware/multer.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";
const router = Router();

import {
  userSingUp,
  userLogin,
  getuserinfobyid,
  CarList,
  Booking,
  CheckAvailability,
  edituserprofile,
  GetBookingDeatails,
  userOtp,
  Rating,
  GetRating,
  postmessege,
  imageUpload,
  getmessage
} from "../Controllers/userController.js";

router.post("/userSignup", userSingUp);
router.post("/userLogin", userLogin);
router.post("/imageUpload",authMiddleware,upload.single('license'),imageUpload)
router.post("/getuserinfobyid", authMiddleware, getuserinfobyid);
router.post("/userOtp",userOtp)
router.get("/CarList", CarList);
router.post("/Booking", authMiddleware, Booking);
router.get("/CheckAvailability/:carId", CheckAvailability);
router.post("/edituserprofile",authMiddleware,edituserprofile)
router.post("/GetBookingDeatails",authMiddleware,GetBookingDeatails);
router.post("/Rating",Rating);
router.get("/GetRating/:carId",GetRating);
router.post("/postmessege",authMiddleware,postmessege) 
router.get("/getmessage",authMiddleware,getmessage) 


export default router;
