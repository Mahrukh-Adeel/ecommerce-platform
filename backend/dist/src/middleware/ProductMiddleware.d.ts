import type { Request, Response, NextFunction } from "express";
export declare const validateProductId: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const validateCreateProduct: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=ProductMiddleware.d.ts.map