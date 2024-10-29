import mongoose from "mongoose";

export const artSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
});

const artModel=mongoose.model("Art",artSchema);

export default artModel;