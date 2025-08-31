import "express-session";
import { UserDocument } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    passport?: {
      user?: any;
    };
  }
}