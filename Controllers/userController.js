import User from "../Models/userModel.js";
import Partner from "../Models/partnerModel.js";
import securePassword from "../Config/bcryptConfig.js";
import Car from "../Models/carModel.js";
import Bookingmodel from "../Models/bookingModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "../Middleware/cloudinaryConfig.js";
import { otpGen } from "../Config/OtpConfiq.js";
import nodemailer from "nodemailer";
import RatingModel from "../Models/ratingModel.js";
import chatModel from "../Models/chatModel.js";
import ratingModel from "../Models/ratingModel.js";
import cancellationModal from "../Models/cancellationModel.js";

const bcryptPassword = async (password) => {
  try {
    const hashpassword = await bcrypt.hash(password, 10);
    return hashpassword;
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const mail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "carrentalservices3@gmail.com",
      pass: "zehmcugpjzydvuwq",
    },
  });

  const mailOptions = {
    from: "carrentalservices3@gmail.com",
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      return info.response;
    }
  });
};

const paymentSucess = (email) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "carrentalservices3@gmail.com",
      pass: "zehmcugpjzydvuwq",
    },
  });

  const mailOptions = {
    from: "carrentalservices3@gmail.com",
    to: email,
    subject: "Booking acknowlegement",
    text: `your booking has been created`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      return info.response;
    }
  });
};

let otp;
let userData;
const userSingUp = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res
        .status(200)
        .send({ message: "User already exist", success: false });
    } else {
      otp = otpGen();
      console.log(otp);
      userData = req.body;
      mail(req.body.email, otp);
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error signing up" });
  }
};

const imageUpload = async (req, res) => {
  try {
    const id = req.userId;
    const licenseImage = req.file;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    let result = await cloudinary.uploader.upload(licenseImage.path);
    user.Licence = result.secure_url;
    await user.save();
    res.status(200).json({
      success: true,
      message:
        "Image uploaded to Cloudinary and Licence URL saved successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const userOtp = async (req, res) => {
  try {
    const enteredOtp = req.body.enteredOtp;
    if (enteredOtp === otp) {
      const userDetails = userData;
      console.log(userDetails);
      const { name, email, password } = userDetails;
      const hashpassword = await bcryptPassword(userDetails.password);
      await User.insertMany([
        {
          name: userDetails.name,
          email: userDetails.email,
          password: hashpassword,
        },
      ]);
      res
        .status(200)
        .json({ message: "User created successfully", success: true });
    } else {
      res.status(200).json({ error: true });
    }
  } catch (error) {
    res.status(500).json();
  }
};

const googleAuthencate = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      const createUser = new User({
        name,
        email,
      });
      await createUser.save();
      const token = jwt.sign({ id: userData._id }, process.env.JWT_Secret, {
        expiresIn: "1d",
      });
      return res
        .status(200)
        .send({ message: "User created successfully", success: true, token });
    } else {
      const token = jwt.sign({ id: userData._id }, process.env.JWT_Secret, {
        expiresIn: "1d",
      });
      return res
        .status(201)
        .send({ message: "Login successfully", success: true, token });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    if (!user.isBlocked) {
      return res
        .status(200)
        .send({ message: "User is blocked and cannot log in", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_Secret, {
        expiresIn: "1d",
      });
      res.status(200).send({
        message: "User logged in successfully",
        success: true,
        token,
        userid: user._id,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

const getuserinfobyid = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
          image: user.image,
          isUser: user.isUser,
          Licence: user.Licence,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
};

const edituserprofile = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.userId, {
      name: req.body.name,
      email: req.body.email,
    });
    if (result) {
      res
        .status(200)
        .send({ message: "User profile updated successfully", success: true });
    } else {
      res
        .status(200)
        .send({ message: "User profile not updated", success: false });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
};

const partnerBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const PartnerData = await Partner.findOne({ _id: id });
    PartnerData.isBlocked = !PartnerData.isBlocked;
    const update = await PartnerData.save();
    const partner = await Partner.find().lean();
    if (update) {
      res.status(200).send({
        message: "status is changed",
        success: true,
        Partner: partner,
      });
    } else {
      res.status(200).send({ message: "ooops", success: false });
    }
  } catch (error) {
    res.status(200).send({ message: "Somthing wrong", success: false });
  }
};

const CarList = async (req, res) => {
  try {
    const cardata = await Car.find().populate("partnerId").populate("category");
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

const Booking = async (req, res) => {
  try {
    const userId = req.userId;
    const bookingData = { ...req.body, userId };
    const newBooking = await Bookingmodel.create(bookingData);
    const data2 = await Bookingmodel.find(newBooking._id)
      .populate("userId")
      .populate("partnerId");
    if (newBooking) {
      res.status(200).json({
        message: "Booking created successfully",
        success: true,
        data: data2,
      });
    } else {
      res.status(200).send({ message: "ooops", success: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "Booking creation failed",
      success: false,
      error: error.message,
    });
  }
};

const GetBookingDeatails = async (req, res) => {
  try {
    const userId = req.userId;
    const BookingData = await Bookingmodel.find({ userId })
      .populate("CarId", "Images")
      .populate("RatingId");
    res.status(200).json({
      success: true,
      message: "Booking details retrieved successfully",
      data: BookingData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking details",
    });
  }
};

const CheckAvailability = async (req, res) => {
  const carId = req.params.carId;
  try {
    const bookedDateRanges = await Bookingmodel.find(
      { CarId: carId },
      { startDate: 1, endDate: 1, _id: 0 }
    );
    res.json(bookedDateRanges);
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const Rating = async (req, res) => {
  try {
    const { booking, CarId, partnerId, userId, stars, review } = req.body;
    const existingRating = await RatingModel.findOne({ booking, userId });
    if (existingRating) {
      existingRating.stars = stars;
      existingRating.review = review;
      await existingRating.save();
      res.status(200).json({
        message: "Rating updated successfully",
        success: true,
        data: existingRating,
      });
    } else {
      const newRating = new RatingModel({
        booking: booking,
        partnerId: partnerId,
        userId: userId,
        CarId: CarId,
        stars,
        review,
      });
      await newRating.save();
      const Ratingid = await RatingModel.findOne({ userId: userId });
      await Bookingmodel.updateOne(
        { userId: userId },
        { $set: { RatingId: Ratingid._id } }
      );
      res.status(200).json({
        message: "Rating saved successfully",
        success: true,
        data: newRating,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const GetRating = async (req, res) => {
  try {
    const carId = req.params.carId;
    const rating = await RatingModel.find({ CarId: carId }).populate("userId");
    if (rating) {
      res.status(200).json({
        message: "Rating retrieved successfully",
        success: true,
        data: rating,
      });
    } else {
      res.status(404).json({ message: "Rating not found", success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const postmessege = async (req, res) => {
  try {
    const userId = req.userId;
    const { text, sender } = req.body;
    const newMessage = new chatModel({
      senter: sender,
      text: text,
      userId: userId,
    });
    await newMessage.save();
    res
      .status(200)
      .json({ success: true, message: "Message send successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving message" });
  }
};

const getmessage = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await chatModel
      .find({
        userId,
      })
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, messages: data, message: "succesully get" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const getorders = async (req, res) => {
  try {
    const userId = req.userId;
    const latestOrders = await Bookingmodel.find({
      userId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("CarId");
    res.status(200).json({ orders: latestOrders, success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const cancellation = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId, reason } = req.body;
    const cancellation = new cancellationModal({ bookingId, reason });
    await cancellation.save();
    const updatedBooking = await Bookingmodel.findOneAndUpdate(
      { _id: bookingId },
      { $set: { status: "canceled" } },
      { new: true }
    );
    if (!updatedBooking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Cancellation reason saved." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export {
  userSingUp,
  userLogin,
  getuserinfobyid,
  partnerBlock,
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
  getmessage,
  getorders,
  cancellation,
  googleAuthencate,
};
