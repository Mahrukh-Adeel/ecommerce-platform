import type { Request, Response } from 'express';
export declare const getUserCart: (req: Request, res: Response) => Promise<void>;
export declare const addToCart: (req: Request, res: Response) => Promise<void>;
export declare const updateCartItem: (req: Request, res: Response) => Promise<void>;
export declare const removeFromCart: (req: Request, res: Response) => Promise<void>;
export declare const clearCart: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=cartController.d.ts.map