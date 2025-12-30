import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
const router = express.Router();
import { auth, UserRole } from "../../middlewares/auth";

router.post("/", auth(UserRole.USER), PostController.createPost);

export const postRouter: Router = router;
