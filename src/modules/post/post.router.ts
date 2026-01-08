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
router.get("/status", auth(UserRole.ADMIN), PostController.getStatus);

router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.patch(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.updatePost,
);

router.delete(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  PostController.deletePost,
);

export const postRouter: Router = router;
