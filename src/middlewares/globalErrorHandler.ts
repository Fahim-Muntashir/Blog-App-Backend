import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;

  // prisma client validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Validation Error";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // handle known prisma errors
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        errorMessage = "Unique constraint failed";
        break;
      case "P2025":
        statusCode = 404;
        errorMessage = "Record not found";
        break;
      default:
        statusCode = 400;
        errorMessage = "Database Error";
    }
  }
  res.status(statusCode);
  res.json({
    error: errorMessage,
    details: errorDetails,
  });
}
export default errorHandler;
