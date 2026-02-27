import mongoose from "mongoose";
import dotenv from 'dotenv'

// dotenv.config({path:'../config.env'})


const Connection = async () => {
  await mongoose.connect(process.env.DATABASE).then(() => {
    console.log('Database connected successfully');
  }).catch((e) => {
    console.error('Database connection error:', e.message);
  });
};

export default Connection;
