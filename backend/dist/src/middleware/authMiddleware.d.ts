import type { Request, Response, NextFunction } from "express";
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireSessionAuth: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const requireAnyAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireSelfOrAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map