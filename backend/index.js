import express from 'express';
import cors from "cors"
import helmet from "helmet";


// dotenv
import dotenv from 'dotenv';
dotenv.config();


// database connection
import connectDB from './src/configs/db.connect.js';
await connectDB();


const app = express();


// use cors
import { corsOption } from './src/utils/frontendCors.js'
app.use(cors(corsOption));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());


import cookieParser from "cookie-parser";
app.use(cookieParser());

// ratelimit
import { limiter } from './src/utils/rateLimit.js';
app.use(limiter)


export default app;