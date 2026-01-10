import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { Post, PostStatus } from "../../../generated/prisma/client";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Post creation failed",
      });
    }

    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const searchString = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
          ? false
          : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const { page, limit, sortBy, skip, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const result = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };

    const post = await postService.getPostById(id);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "you are not authorized",
      });
    }
    const post = await postService.getPostById(user?.id as string);

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({
      error: "Failed to retrieve post",
      details: error,
    });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "you are not authorized",
      });
    }

    const { postId } = req.params as { postId: string };

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await postService.updatePost(
      postId,
      req.body,
      user?.id as string,
      isAdmin,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update post",
      details: error,
    });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "you are not authorized",
      });
    }

    const { postId } = req.params as { postId: string };

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await postService.deletePost(
      postId,
      user?.id as string,
      isAdmin,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to DELETE post",
      details: error,
    });
  }
};

const getStatus = async (req: Request, res: Response) => {
  try {
    const result = await postService.getStatus();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to get status of post",
      details: error,
    });
  }
};
export const PostController = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  getMyPosts,
  deletePost,
  getStatus,
};
