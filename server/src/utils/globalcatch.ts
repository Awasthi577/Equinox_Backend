import { Request, NextFunction, Response } from "express";
export const globalCatch = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "something went wrong" })
}