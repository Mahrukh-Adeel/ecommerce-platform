import passport from "passport";
import type { Request, Response, NextFunction } from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {

    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication error', 
        error: err.message 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Invalid or expired token',
        error: info?.message || 'No valid token provided'
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const requireSessionAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: 'Please log in to access this resource'
  });
};

export const requireAnyAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  requireAuth(req, res, next);
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication error', 
        error: err.message 
      });
    }

    if (user) {
      req.user = user;
    }
    
    next();
  })(req, res, next);
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication error', 
        error: err.message 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Invalid or expired token',
        error: info?.message || 'No valid token provided'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden - Admin access required' 
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const requireSelfOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication error', 
        error: err.message 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Invalid or expired token',
        error: info?.message || 'No valid token provided'
      });
    }

    const userId = req.params.userId || req.params.id;
    const isOwner = user._id.toString() === userId;

    console.log('Auth Check:', {
      userIdFromParams: userId,
      userIdFromToken: user._id.toString(),
      isOwner,
      isAdmin: user.role === 'admin',
      userRole: user.role
    });

    if (!isOwner && user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Forbidden - You can only access your own data or be an admin' 
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};