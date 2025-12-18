import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// simple request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopDb";
let dbConnected = false;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    dbConnected = true;
    console.log("mongodb connected:" + mongoUri);
}).catch((err) => {
    dbConnected = false;
    console.error("MongoDB connection error:", err);
});

mongoose.connection.on('connected', () => {
    dbConnected = true;
    console.log('Mongoose connection event: connected');
});
mongoose.connection.on('error', (err) => {
    dbConnected = false;
    console.error('Mongoose connection event: error', err);
});
mongoose.connection.on('disconnected', () => {
    dbConnected = false;
    console.warn('Mongoose connection event: disconnected');
});
const productSchema =new mongoose.Schema({
    name:String,
    price:Number,
    image:String
});
const Product=mongoose.model("Product",productSchema);

// middleware to ensure DB is connected before handling DB routes
const ensureDb = (req, res, next) => {
    if (!dbConnected && mongoose.connection.readyState !== 1) {
        console.error('DB not connected, rejecting request for', req.url);
        return res.status(500).json({ error: 'database not connected' });
    }
    next();
};

app.get("/products", ensureDb, async(req,res)=>{
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error("/products error:", err);
        res.status(500).json({ error: "internal server error" });
    }

});
app.get("/seed" ,ensureDb, async(req,res)=>{
    try{
        const fname= fileURLToPath(import.meta.url);
        const dirname=path.dirname(fname);
        const data = fs.readFileSync(path.join(dirname,"Product.json"),"utf-8");
        const products = JSON.parse(data);

        await Product.deleteMany({});
        await Product.insertMany(products);
        res.send("database seeded");
    } catch (err) {
        console.error("/seed error:", err);
        res.status(500).json({ error: "internal server error" });
    }

});
app.post("/signup", ensureDb, async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({ error: 'user already exists' });
        const hashedPass =await bcrypt.hash(password,10);
        const user= new User({name,email,password:hashedPass});
        await user.save();
        res.json({message:"user registered"});
    } catch (err) {
        console.error("/signup error:", err);
        res.status(500).json({error:'internal server error'});
    }
});
app.post("/login", ensureDb, async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(400).json({ error: 'email and password required' });
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({error:"user not found"});
        const valid= await bcrypt.compare(password, user.password);
        if(!valid) return res.status(400).json({error:"invalid password"});
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET || "Secret Key",{expiresIn:"1h"});
        res.json({token,user:{name:user.name,email:user.email}});
    } catch(err){
        console.error('/login error:', err);
        res.status(500).json({ error: 'internal server error' });
    }
});
const auth= (req,res,next)=>{
    const token = req.headers["authorization"];
    if(!token) return res.status(401).json({error:"no token"});
    try{
        const decoded = jwt.verify(token.split(" ")[1],process.env.JWT_SECRET || "Secret Key");
        req.user = decoded;
        next();

    }
    catch(err){
        res.status(401).json({error:"invalid token"});

    }
};
app.get("/profile",auth, async(req,res)=>{
    try{
        const user= await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch(err){
        console.error('/profile error:', err);
        res.status(500).json({ error: 'internal server error' });
    }
})
// global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'internal server error' });
});
// health endpoint
app.get('/health', (req, res) => {
    res.json({ ok: true, dbConnected: mongoose.connection.readyState === 1 });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));


