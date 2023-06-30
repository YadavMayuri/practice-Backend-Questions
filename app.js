console.log("working");

import  express from "express"
import mongoose from "mongoose";
import morgan from "morgan";
import router from "./routes/ProductRoutes.js";


const app = express();

app.use(morgan('dev'))
app.use(express.json());
app.use('/api/product',router)


mongoose.connect('mongodb+srv://mayuriyadav54:HGU1ZbJCNcqlTu0z@cluster0.s9gcceb.mongodb.net/PracticeNodeQuestions')
.then(()=> console.log("DB connected"))
.catch((err)=> console.log("DB error=>",err))


app.listen(8000, ()=> console.log("Working on port 8000"));

