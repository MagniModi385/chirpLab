import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:
    {
        type:String,
        required:true,
        unique:true,
    },
    password:
    {
        type:String,
        required:true,
        minlength:8
    },
    bio:
    {
        type:String,
        default:"",
    },
     profilePic:
    {
        type:String,
        default:"",
    },
     coreLanguage:
    {
        type:String,
        default:"",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    isOnboarded:
    {
        type:Boolean,
        default:false,
    },
    friends:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]
},{timestamps:true});

//this runs before creating object and hashes the password so its hidden in the
//database
userSchema.pre('save',async function(next)
{
    //if user is trying to update anything else than the password the hashing wont work until 
    //user works with password
    //This is very important
    if(!this.isModified("password")) return next();
    try
    {
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    }catch(error)
    {
        next(error);
    }
});
//check password
userSchema.methods.matchPassword= async function(enteredPassword)
{
   const isPasswordCorrect= await bcrypt.compare(enteredPassword,this.password);
   return isPasswordCorrect;
}
//creating the model of the user.
const User=mongoose.model('User',userSchema);   
export default User;