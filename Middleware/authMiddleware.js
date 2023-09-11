import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .send({ message: "Authorization token missing", success: false });
    }
    jwt.verify(token, process.env.JWT_Secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Auth failed", success: false });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    return res
      .status(401)
      .send({ message: "Auth error failed", success: false, error });
  }
};

const isPartnerMiddleware = (req, res, next) => {
  try {
    const partnerToken = req.headers.authorization;
    if (!partnerToken) {
      return res
        .status(401)
        .send({ message: "Authorization token missing", success: false });
    }
    jwt.verify(partnerToken, process.env.JWT_Secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Auth failed", success: false });
      } else {
        req.partnerid = decoded.id;
        next();
      }
    });
  } catch (error) {
    return res
      .status(401)
      .send({ message: "Auth error failed", success: false, error });
  }
};

const isAdminMiddleware = (req, res, next) => {
  try {
    const admintoken = req.headers.authorization;

    if (!admintoken) {
      console.log("admin toke ");
      return res
        .status(401)
        .send({ message: "Authorization token missing", success: false });
    }
    jwt.verify(admintoken, process.env.JWT_Secret, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ message: "Auth failed", success: false });
      } else {
        req.adminId = decoded.id;
        next();
      }
    });
  } catch (error) {
    return res
      .status(401)
      .send({ message: "Auth error failed", success: false, error });
  }
};

export { authMiddleware, isPartnerMiddleware, isAdminMiddleware };
