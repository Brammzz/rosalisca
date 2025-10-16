import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateJWToken } from '../utils/jwt.js';

// Utility to generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Generate JWT cookie
      const cookieToken = generateJWToken(res, user._id.toString());
      
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
        cookieToken: cookieToken,
        success: true,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie('user', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server Error during logout' 
    });
  }
};

// @desc    Get current user from cookie
// @route   GET /api/auth/me
// @access  Protected (requires cookie)
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server Error' 
    });
  }
};
