import jwt from "jsonwebtoken";

export const authenticatedUser = async (req, res, next) => {
  const cookie = req.cookies.user;
  
  try {
    if (!cookie) {
      res.status(200).json({ 
        success: false, 
        user: null, 
        message: "Token não encontrado" 
      });
      return;
    }
    
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    res.status(200).json({ 
      success: false, 
      user: null, 
      message: "Token inválido" 
    });
  }
};
