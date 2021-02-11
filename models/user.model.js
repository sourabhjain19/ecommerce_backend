import mongoose from "mongoose";
const {model}=mongoose;
const {Schema}=mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 4,
    max: 256
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 256
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 256
  },
  shipping:{
    type: String,
    required:true,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export const User = model("User", userSchema);
