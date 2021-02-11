import express from "express";
import dotenv from "dotenv";
import process from "process";
import cors from "cors";
import mongoose from "mongoose";

import { Cart } from './models/cart.js';
import { User } from './models/user.model.js'

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

mongoose.connect(
  process.env.DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => {
    console.log("Connected to DB");
  },
);

app.post('/register', async (req, res) => {
  const newuser = new User({ ...req.body });
  const savedUser = await newuser.save();
  res.json(savedUser);
});


app.post('/login', async (req, res) => {
  
  const user = await User.findOne({ ...req.body });
  if (user) {
    res.json(user._id);
  }
  else {
    res.send("Error");
  }
});

const verify = async (req, res, next) => {
  const user = await User.findOne({_id:req.header("authorization")})
  if (user) {
    req.user = user;
    next();
  }
  else {
    res.send("Error");
  }
}

app.post('/additem', verify, async (req, res) => {
  const cartitem=new Cart({...req.body,"userid":req.user._id});
  const saveditem=await cartitem.save();
  res.json(saveditem);
})

app.get('/getcartitem', verify,async (req, res) => {
  const items=await Cart.find({userid:req.user._id})
  res.json(items);  
})

app.delete('/deleteitem',verify,async (req,res)=>{
  const removeitem=await Cart.remove({userid:req.user._id,itemid:req.body.itemid})
  res.json(removeitem);
})

app.put('/updateitem',verify,async (req,res)=>{
  const modifyitem=await Cart.update({userid:req.user._id,itemid:req.body.itemid},{$set:{quantity:req.body.quantity}})
  res.json(modifyitem);
})

app.get('/checkout',verify,async(req,res)=>{
  const items=await Cart.find({userid:req.user._id})
  var total=0;
  items.forEach((item)=>{
    total+=item.quantity*item.price;
  });
  total=total+5/100*total;
  res.json({"Price to be Paid": total,"msg":"Thank you visit again","shipping":req.user.shipping});

  const removeitems=await Cart.remove({userid:req.user._id});
})

const port = 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
