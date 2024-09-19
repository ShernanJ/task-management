import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new user
    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  };
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Finding the user
    const user: IUser | null = await User.findOne({email});
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return; 
    }

    // Checking the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || '', {
      expiresIn: '1h'
    });
    res.json({ token });
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}