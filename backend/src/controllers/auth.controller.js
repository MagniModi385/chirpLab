    import User from "../models/User.js";
    import jwt from "jsonwebtoken";
    import {upsertStreamUser} from "../lib/stream.js";
    import { sendEmail } from "../utils/sendEmail.js";
    import crypto from 'crypto';
    import bcrypt from 'bcryptjs';
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // 1. Simple email validation (no external library)
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: "Please provide a valid email address" 
    });
  }

  try {
    // 2. Case-insensitive email search
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });

    // 3. Always return same message for security
    const responseMessage = "If this email exists, you'll receive a temporary password";
    if (!user) {
      return res.status(200).json({ 
        success: true,
        message: responseMessage
      });
    }

    // 4. Generate temp password
    const tempPassword = crypto.randomBytes(4).toString('hex');
    user.password = tempPassword; // Will be hashed by pre-save hook
    user.passwordChangedAt = Date.now();
    
    await user.save();

    // 5. Send email (fire-and-forget)
    sendEmail(
      email,
      "Your Temporary Password",
      `YOUR TEMPORARY PASSWORD: ${tempPassword}\nWe are in the process of making a reset Link.\nSo please bear with us.`
    ).catch(error => console.error("Email send error:", error));

    res.status(200).json({
      success: true,
      message: responseMessage
    });

  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};
    export async function signup(req,res)
    {
    const{email,password,fullName}=req.body;
    try{
        if(!fullName || !email || !password)
            {
                    return res.status(400).json({message:"All fields are required "});
            }
        if(password.length<8)
            {
                return res.status(400).json({message:"Password length should be minimum 8 characters"});
            }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email))
            {
                return res.status(400).json({message:"Invalid email format"});
            }
        const existingUser= await User.findOne({email});
        if(existingUser)
            {
                return res.status(400).json({message:"Email already exists"});

            }

        const ind=Math.floor(Math.random()*100)+1;
        const randomAvatar=`https://avatar.iran.liara.run/public/${ind}.png`;
        const newUser=await User.create({
            email,fullName,password,
            profilePic:randomAvatar,
        })
        //connection with streamchat
        try {
              await upsertStreamUser({
            id:newUser._id.toString(),
            name:newUser.fullName,
            image:newUser.profilePic || "",
        });
        console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error in creating stream user: ",error)
        }
      //cookie generation
        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'});
        res.cookie("jwt",token,
            {
                maxAge: 7*24*60*60*1000,
                httpOnly:true,//prevent xss attacks
                sameSite:"strict",//prevent csrf atactks
                secure:process.env.NODE_ENV === 'production',
            })  
        res.status(201).json({success:true, user:newUser});
    }
    catch(error)
    {
        console.log("Error in signup controller",error);
        res.status(500).json({message:"Internal server error"});
    }
    }
    export async function login(req,res)
    {
       try{
        const {email,password}=req.body;
       
       if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
       }
       const user=await User.findOne({email});
       if(!user) return res.status(401).json({message:"Invalid email or password"});
       const isPasswordCorrect=await user.matchPassword(password);
       if(!isPasswordCorrect) return res.status(401).json({message:"Invalid email or password"});

        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'7d'});
        res.cookie("jwt",token,
            {
                maxAge: 7*24*60*60*1000,
                httpOnly:true,//prevent xss attacks
                sameSite:"strict",//prevent csrf atactks
                secure:process.env.NODE_ENV === 'production',
            })  
        res.status(200).json({success:true, user});
       }
       catch(error)
       {
         console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal server error"});
       }
    }
    export async function logout(req,res)
    {
        res.clearCookie("jwt");
        res.status(200).json({success:true,message:"Logout successfull"});
    }
    export async function onboard(req,res)
    {
        try {
            const userId=req.user._id;
            const{fullName,bio,coreLanguage,learningLanguage,location}=req.body;
            if(!fullName || !bio || !coreLanguage || !learningLanguage || !location)
                {
                    return res.status(400).json({
                    message:"All fields are required",
                    missingFields:
                    [
                        !fullName && "fullName",
                        !bio && "bio",
                        !coreLanguage && "coreLanguage",
                        !learningLanguage &&"learningLanguage",
                        !location && "location",
                    ].filter(Boolean),
                    });
                }
          const updatedUser=await User.findByIdAndUpdate(userId,
                {
                    ...req.body,isOnboarded:true,
                },{new:true});
                if(!updatedUser) return res.status(404).json({message:"User not found"});
                //todo update user info in stream chat  
           try {
             await upsertStreamUser(
                {
                id: updatedUser._id.toString(),
                name:updatedUser.fullName,
                image: updatedUser.profilePic || "",
                })
                console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
           } catch (streamError) {
            console.log("Error in updating Stream user during onboarding:",streamError.message);
           }
            res.status(200).json({success:true,user:updatedUser});
        } catch (error) {
            console.error("Onboarding error",error);
            res.status(500).json({message:"Internal server error"});
        }
    }
