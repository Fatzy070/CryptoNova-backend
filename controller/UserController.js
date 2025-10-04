import User from "../models/UserSchema.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const SignUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // create token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      user: { id: newUser._id, email: newUser.email, name: newUser.name },
      token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating User", error);
    res.status(500).json({ message: "Server error creating new user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(409).json({ message: "Invalid password" });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name },
      token,
    });
    console.log("user logged in");
  } catch (error) {
    console.error("cannot login", error);
    res.status(500).json({ message: "Server error while logging in" });
  }
};


export const profile = async(req , res ) => {
    try {
          const getUser = await User.findById(req.user.id).select("-password");

    if (!getUser) {
      return res.status(404).json({ message: "User not found" });
    }


        res.status(200).json({
            user:{ id: getUser._id , name:getUser.name , email: getUser.email } ,
            message:"fetched user successfully"
        })

    } catch (error) {
        console.error("cannot fetch user" , error)
        res.status(500).json({ message:"Server error while fetching" })
    }
}

export const logoutUser = async (req, res) => {
  try {
    // No refresh tokens stored, so just respond success
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body; // get token from frontend

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    // check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // create new user if doesn't exist
      user = await User.create({
        email,
        name,
        password: "", // empty because Google login
        avatar: picture, // optional
      });
    }

    // create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar },
      token,
      message: "Login with Google successful",
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error during Google login" });
  }
};
