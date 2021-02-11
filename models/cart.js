import mongoose from "mongoose";
const {model}=mongoose;
const {Schema}=mongoose;

const CartSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    itemid: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: Date.now()
    }
})

export const Cart = model("carts", CartSchema)