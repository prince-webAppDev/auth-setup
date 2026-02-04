import User from "../../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import RefreshToken from "../../models/refreshToken.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/genrateJwt.js";


export const registerUser = async (req, res) => {
  const {username , email , password }= req.body;
  try {

    if(!username || !email || !password){
      return res.status(400).json({message : "All fields are required"});
    }
    const userAlredyExists = await User.findOne({email})
    if(userAlredyExists){
      return res.status(400).json({message : "User already exists Please login"});
    }
    const hashedPassword = await bcrypt.hash(password , 10);
    const newUser = await User.create({
      username,
      email,
      password : hashedPassword
    });
    return res.status(201).json({
      message : "User registered successfully",
      user : {
        id : newUser._id,
        username : newUser.username,
        email : newUser.email
      }
    })
    
  } catch (error) {
    return res.status(500).json({message : "Internal Server Error", error : error.message});
    
  }
}

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // hash refresh token before saving in db
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await RefreshToken.create({
    user: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ message: "Login successful" });
};

export const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await RefreshToken.deleteOne({ tokenHash: hash });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
};




export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const storedToken = await RefreshToken.findOne({
    user: decoded.userId,
    tokenHash
  });

  if (!storedToken) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const newAccessToken = generateAccessToken(decoded.userId);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000
  });

  res.json({ message: "Access token refreshed" });
};



export const saferoute = async (req, res) => {
  res.send("protected route");

}

export const googleAuthCallback = async (req, res) => {
  try {
    const profile = req.user;

    if (!profile) {
      return res.status(401).json({ message: "Google authentication failed" });
    }

    // 1 Find user by googleId
    let user = await User.findOne({ googleId: profile.id });

    // 2 If user doesn't exist → create user
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
        avatar: profile.photos?.[0]?.value
      });
    }

    // 3 Generate tokens (SAME as normal login)
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 4 Hash refresh token before saving
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // 5 Store refresh token in DB
    await RefreshToken.create({
      user: user._id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // 6️ Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

   
    res.redirect(process.env.CLIENT_URL);

  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


