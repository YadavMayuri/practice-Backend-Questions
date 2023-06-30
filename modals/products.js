import mongoose from "mongoose";
import { Schema } from "mongoose";

const product = new Schema({
    
    p_id: String,
    name: String,
    price:Number,
    Quantity: Number,
    instock: String,
    description : String,
    category: String
})

export default mongoose.model("Products",product);
