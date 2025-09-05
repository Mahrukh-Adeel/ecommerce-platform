import type { Request, Response } from 'express';
export declare const getAllOrders: (req: Request, res: Response) => Promise<void>;
export declare const getOrdersByUser: (req: Request, res: Response) => Promise<void>;
export declare const getOrderById: (req: Request, res: Response) => Promise<void>;
export declare const createOrder: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
export declare const deleteOrder: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=orderController.d.ts.map