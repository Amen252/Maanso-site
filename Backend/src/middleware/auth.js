import { jwtVerify } from 'jose';
import User from '../modules/users/user.model.js';
import { JWT_SECRET } from '../utils/getJWTSecret.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid or expired" });
  }
};

export default auth;
