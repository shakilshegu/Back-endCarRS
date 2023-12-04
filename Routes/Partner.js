import { Router } from "express";
import upload from "../Middleware/multer.js";
import { isPartnerMiddleware } from "../Middleware/authMiddleware.js";
const router = Router();

import {
  partnerSignup,
  partnerLogin,
  getpartnerinfobyid,
  addCarpost,
  viewCar,
  getCategory,
  deleteCar,
  EditCar,
  GetOrder,
  changestatus,
  editpartnerprofile,
  UploadLocation
} from "../Controllers/PartnerController.js";

router.post("/partnersignup", partnerSignup);
router.post("/partnerLogin", partnerLogin);
router.get("/getCategory", getCategory);
router.post("/getpartnerinfobyid", isPartnerMiddleware, getpartnerinfobyid);

router.post(
  "/addCarpost",
  isPartnerMiddleware,
  upload.array("image",4),
  addCarpost
);
router.post("/viewCar", isPartnerMiddleware, viewCar);
router.delete("/deleteCar/:id", deleteCar);
router.put("/EditCar/:carId", upload.array("image",4), EditCar);
router.post("/GetOrder", isPartnerMiddleware, GetOrder);
router.put("/UpdateOrderStatus/:id", changestatus);
router.post("/editpartnerprofile",isPartnerMiddleware,editpartnerprofile);
router.post("/UploadLocation",isPartnerMiddleware,UploadLocation);


export default router;
