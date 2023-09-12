import Partner from "../Models/partnerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import securePassword from "../Config/bcryptConfig.js";
import cloudinary from "../Middleware/cloudinaryConfig.js";
import Car from "../Models/carModel.js";
import Category from "../Models/categoryModel.js";
import BookingModel from "../Models/bookingModel.js";

const partnerSignup = async (req, res) => {
  try {
    const PartnerExist = await Partner.findOne({ email: req.body.email });
    if (PartnerExist) {
      return res
        .status(200)
        .send({ message: "partner already exist", success: false });
    }
    const hashedpassword = await securePassword(req.body.password);
    const partner = new Partner({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedpassword,
    });
    await partner.save();
    res
      .status(200)
      .send({ message: "parnter created successfully", success: true });
  } catch (error) {
    res.status(500).send({
      message: "There was an error while creating the partner",
      error,
      success: false,
    });
    console.log(error);
  }
};

const partnerLogin = async (req, res) => {
  try {
    const partner = await Partner.findOne({ email: req.body.email });
    if (!partner) {
      return res
        .status(200)
        .send({ message: "partner does not exist", success: false });
    }
    if (partner.isBlocked) {
      return res
        .status(200)
        .send({ message: "Your account is not approved", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, partner.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const partnerToken = jwt.sign(
        { id: partner._id },
        process.env.JWT_Secret,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({
        message: "User logged in successfully",
        success: true,
        partnerToken,
        partnerid: partner._id,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

const getpartnerinfobyid = async (req, res) => {
  try {
    const partner = await Partner.findById(req.partnerid);
    if (!partner) {
      return res
        .status(200)
        .send({ message: "partner not found", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: partner.name,
          email: partner.email,
          phone: partner.phone,
          id: partner._id,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting partner info", success: false, error });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res
      .status(200)
      .send({ message: "Car fetched successsfully", success: true, category });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong on server side" });
  }
};

const addCarpost = async (req, res) => {
  try {
    const partnerid = req.partnerid;
    const {
      name,
      brand,
      year,
      color,
      mileage,
      price,
      category,
      location,
      description,
      carNo,
    } = req.body;

    const imageFile = req.files;
    var results = [];
    for (let i = 0; i < imageFile.length; i++) {
      let result = await cloudinary.uploader.upload(imageFile[i].path);
      results.push(result);
    }
    for (let i = 0; i < results.length; i++) {
      if (!results[i].secure_url) {
        throw new Error(
          "Cloudinary upload failed or returned an invalid result."
        );
      }
    }
    if (!partnerid) {
      return res
        .status(404)
        .send({ message: "Partner not found", success: false });
    }
    var path = [];
    for (let i = 0; i < results.length; i++) {
      let x = results[i].secure_url;
      path.push(x);
    }

    const car = new Car({
      name,
      brand,
      year,
      mileage,
      price,
      color,
      category,
      description,
      location,
      carNo,
      Images: path,
      partnerId: partnerid,
    });
    await car.save();
    res.status(200).send({
      message: "Car added successfully",
      success: true,
      car,
    });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
      success: false,
    });
  }
};

const viewCar = async (req, res) => {
  try {
    const partnerid = req.partnerid;
    const cardata = await Car.find({ partnerId: partnerid }).populate(
      "category"
    );
    res.status(200).send({
      message: "Car fetched successsfully",
      success: true,
      cardata,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting car info", success: false, error });
  }
};

const deleteCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const deletedCar = await Car.findByIdAndDelete(carId);
    if (deletedCar) {
      res.json({ success: true, message: "Car deleted successfully." });
    } else {
      res.json({ success: false, message: "Car not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred." });
  }
};

const EditCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const updatedCarData = req.body;
    const newCategoryId = req.body.categoryId;
    const images = req.files;
    const imageUrls = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path);
      imageUrls.push(result.secure_url);
    }
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { ...updatedCarData, category: newCategoryId, Images: imageUrls },
      { upsert: true }
    );
    res.status(200).send({
      message: "Car updated successfully",
      success: true,
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res
      .status(500)
      .send({ message: "Something went wrong on the server side" });
  }
};

const GetOrder = async (req, res) => {
  try {
    const partnerid = req.partnerid;
    const orderData = await BookingModel.find({ partnerId: partnerid })
      .populate("category")
      .populate("CarId");
    res.status(200).send({
      message: "Oder fetched successsfully",
      success: true,
      orderData,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting car info", success: false, error });
  }
};

const changestatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const editpartnerprofile = async (req, res) => {
  try {
    const result = await Partner.updateOne(
      { _id: req.partnerid },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          location: req.body.location,
        },
      }
    );
    if (result) {
      res.status(200).send({
        message: "partner profile updated successfully",
        success: true,
      });
    } else {
      res
        .status(200)
        .send({ message: "partner profile not updated", success: false });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
};

const UploadLocation = async (req, res) => {
  try {
    const { data, location } = req.body;
    const partnerId = data.id;
    const partnerData = await Partner.findOne({ _id: partnerId });
    if (!partnerData) {
      return res
        .status(404)
        .json({ success: false, message: "Partner not found" });
    }
    if (partnerData.location.includes(location)) {
      return res.status(200).json({
        message: "Location already exists",
        success: false,
      });
    }
    partnerData.location.push(location);
    await partnerData.save();

    return res.status(200).json({
      message: "Location added successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export {
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
  UploadLocation,
};
