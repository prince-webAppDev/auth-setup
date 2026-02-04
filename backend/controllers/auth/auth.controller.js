import User from "../../models/auth.model.js";
import bcrypt from "bcrypt";


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
  const {username, password } = req.body

  try {
    if(!username || !password){
      return res.status(400).json({message:"all fields are required"})
    }
    const user = await User.findOne({username})
    if(!user){
      return res.status(404).json({message:"user not found"})
    }
    const checkPass = await bcrypt.compareSync(password, user.password)
    if(!checkPass){
      res.status(400).json({message:"Invalid Credentials"})
    }
    return res.status(200).json({message :"login successfully"})

    
  } catch (err) {
    res.status(500).json({message:"Internal Server Error"})
    
  }


}

export const logoutUser = async (req, res) => {
  res.send("logout User");

}


