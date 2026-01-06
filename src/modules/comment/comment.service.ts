import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: { id: payload.postId },
  });

  if (payload.parentId) {
    const parentData = await prisma.comment.findUniqueOrThrow({
      where: { id: payload.parentId },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

const getCommentById = async (commentId: string) => {
  const result = await prisma.comment.findUniqueOrThrow({
    where: { id: commentId },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          views: true,
        },
      },
    },
  });

  return result;
};

const getCommentByAuthor = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: { authorId: authorId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return result;
};

const deleteComment = async (commentId: string, authorId: string) => {
  const comment = await prisma.comment.findFirst({
    where: { id: commentId, authorId },
    select: {
      id: true,
    },
  });

  if (!comment) {
    throw new Error("Comment not found or you are not authorized to delete it");
  }

  const result = await prisma.comment.delete({
    where: { id: commentId },
  });
  return result;
};

const updateComment = async (
  commentId: string,
  data: { content: string; status: CommentStatus },
  authorId: string,
) => {
  const comment = await prisma.comment.findFirst({
    where: { id: commentId, authorId },
    select: {
      id: true,
    },
  });

  if (!comment) {
    throw new Error("Comment not found or you are not authorized to delete it");
  }

  const result = await prisma.comment.update({
    where: { id: commentId, authorId },
    data: data,
  });
  return result;
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment,
};
