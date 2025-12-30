import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
const router = express.Router();
import { auth as betterAuth } from "../../lib/auth";

const auth = (...roles: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("middle ware");

    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });

    console.log(session);
    next();
  };
};

router.post("/", auth("ADMIN", "USER"), PostController.createPost);

export const postRouter: Router = router;
