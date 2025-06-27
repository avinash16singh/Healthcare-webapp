import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Role-based access control
    role: {
      type: String,
      enum: ["patient", "doctor", "hospitalAdmin", "centralAdmin", "ambulanceDriver"],
      required: true,
    },
    profilePic: {
      type: String,
      default: "", // URL to cloud storage
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",  
    },
    dob: {
      type: Date,
    },
    // Account control
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
