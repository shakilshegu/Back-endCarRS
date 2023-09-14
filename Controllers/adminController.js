import Admin from "../Models/adminModel.js";
import User from "../Models/userModel.js";
import Partner from "../Models/partnerModel.js";
import Category from "../Models/categoryModel.js";
import securePassword from "../Config/bcryptConfig.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import chatModel from "../Models/chatModel.js";
import bookingModel from "../Models/bookingModel.js";

const adminSingUp = async (req, res) => {
  try {
    const hash = bcrypt.hashSync(password, 10);
    const admin = new Admin({
      email,
      password: hash,
    });
    await admin.save();
    res
      .status(200)
      .send({ message: "admin created successfully", success: true });
  } catch (error) {
    res.status(500).send({
      message: "There was an error while creating the user",
      error,
      success: false,
    });
    console.log(error);
  }
};

const adminLogin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res
        .status(200)
        .send({ message: "Admin does not exist", success: false });
    }
    const Hashpassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!Hashpassword) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const admintoken = jwt.sign({ id: admin._id }, process.env.JWT_Secret, {
        expiresIn: "1d",
      });
      res.status(200).send({
        message: "admin logged in successfully",
        success: true,
        admintoken,
        adminid: admin._id,
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

const getAdmininfobyid = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminid);
    if (!admin) {
      return res
        .status(200)
        .send({ message: "admin not found", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: admin.name,
          email: admin.email,
          id: admin._id,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting admin info", success: false, error });
  }
};

const userList = async (req, res) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .send({ message: "Users fetched successsfully", success: true, users });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong on server side" });
  }
};

const userBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findOne({ _id: id });
    userData.isBlocked = !userData.isBlocked;
    const update = await userData.save();
    const users = await User.find().lean();
    if (update) {
      res
        .status(200)
        .send({ message: "status is changed", success: true, userData: users });
    } else {
      res.status(200).send({ message: "ooops", success: false });
    }
  } catch (error) {
    res.status(200).send({ message: "Somthing wrong", success: false });
  }
};

const Verification = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findOne({ _id: id });
    userData.isUser = !userData.isUser;
    const update = await userData.save();
    const users = await User.find().lean();
    if (update) {
      res
        .status(200)
        .send({ message: "status is changed", success: true, userData: users });
    } else {
      res.status(200).send({ message: "ooops", success: false });
    }
  } catch (error) {
    res.status(200).send({ message: "Somthing wrong", success: false });
  }
};

const partnerBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const partner1 = await Partner.findOne({ _id: id });
    partner1.isBlocked = !partner1.isBlocked;
    const update = await partner1.save();
    const partner = await Partner.find().lean();
    if (update) {
      res
        .status(200)
        .send({ message: "status is changed", success: true, data: partner });
    } else {
      res.status(200).send({ message: "ooops", success: false });
    }
  } catch (error) {
    res.status(200).send({ message: "Somthing wrong", success: false });
  }
};

const partnerList = async (req, res) => {
  try {
    const partner = await Partner.find();
    res.status(200).send({
      message: "partners fetched successsfully",
      success: true,
      partner,
    });
  } catch (error) {
    res.status(500).send({ message: "Something went wrong on server side" });
  }
};

const addcategory = async (req, res) => {
  try {
    const categoryName = req.body.name;
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, "i") },
    });
    if (existing) {
      return res
        .status(200)
        .json({ error: "Category already exists", success: false });
    }
    const savedCategory = await Category.create({ name: categoryName });
    res.status(200).json({ message: "Success", success: true, savedCategory });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", success: false });
  }
};

const getMessages = async (req, res) => {
  try {
    const messagesdata = await chatModel.find({
      userId: req.query.userId,
    });
    res.status(200).json({
      success: true,
      messages: messagesdata,
      message: "succesully get",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error retrieving messages" });
  }
};

const postmessege = async (req, res) => {
  try {
    const { text, selectedUser, sender } = req.body;
    const newMessage = new chatModel({
      senter: sender,
      userId: selectedUser._id,
      text: text,
    });
    await newMessage.save();
    const newData = await chatModel.find({ sender: selectedUser._id });
    res
      .status(200)
      .json({ success: true, message: "Message send successfully", newData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving message" });
  }
};

const getBooking = async (req, res) => {
  try {
    const Data = await bookingModel
      .find()
      .populate("userId")
      .populate("partnerId")
      .populate("CarId");
    res.status(200).json({ success: true, Data, message: "succesully get" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving message" });
  }
};

const getTotalcount = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);

    const BookingCount = await bookingModel.find().count();
    const Users = await User.find().count();
    const Partners = await Partner.find().count();
    const lastTenDaysData = [];
    for (let i = 0; i < 10; i++) {
      const dayStart = new Date(tenDaysAgo);
      const dayEnd = new Date(tenDaysAgo);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dailyDeliveredBookings = await bookingModel.aggregate([
        {
          $match: {
            status: "delivered",
            createdAt: {
              $gte: dayStart,
              $lt: dayEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);

      const dayName = dayStart.toLocaleDateString(undefined, {
        weekday: "long",
      });

      lastTenDaysData.push({
        name: dayName,
        uv:
          dailyDeliveredBookings.length > 0
            ? dailyDeliveredBookings[0].totalAmount
            : 0,
      });

      tenDaysAgo.setDate(tenDaysAgo.getDate() + 1);
    }
    const monthlyDeliveredBookings = await bookingModel.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: {
            $gte: startOfMonth,
            $lt: today,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    const monthlyDeliveredByCategory = await bookingModel.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: {
            $gte: startOfMonth,
            $lt: today,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    const monthlyTotalAmount =
      monthlyDeliveredBookings.length > 0
        ? monthlyDeliveredBookings[0].totalAmount
        : 0;
    res.json({
      lastTenDays: lastTenDaysData,
      monthly: monthlyTotalAmount,
      monthlyC: monthlyDeliveredByCategory,
      count: BookingCount,
      user: Users,
      partner: Partners,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  adminLogin,
  adminSingUp,
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
  getTotalcount,
};
