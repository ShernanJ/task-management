import express from 'express';
import authRoutes from './routes/authRoutes';
import mongoose from 'mongoose';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGODB_URI || '')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})