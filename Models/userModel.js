import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    cartData: { type: Object, default: {} },
    bio:{
      type:String
    },
    portfolio:{
      type:String
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
