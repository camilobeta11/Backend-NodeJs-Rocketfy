import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';


const app = express();
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/rocketfy';

// config
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

// routes
app.use('/api/products', productsRouter);

// connect DB
mongoose.connect(mongodbUri)
.then(() => {
  console.log('MongoDB connection successful');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
