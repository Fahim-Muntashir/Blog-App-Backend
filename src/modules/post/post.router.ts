import express, { NextFunction, Request, Response, Router } from "express";
import { PostController } from "./post.controller";
const router = express.Router();
import { auth, UserRole } from "../../middlewares/auth";

router.post("/", auth(UserRole.USER), PostController.createPost);
router.post(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),

  PostController.getMyPosts,
);

router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);

export const postRouter: Router = router;
