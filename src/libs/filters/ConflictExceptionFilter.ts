import { ArgumentsHost, Catch, ConflictException, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

import ErrorCode from "../constants/ErrorCode";

@Catch(ConflictException)
export default class ConflictExceptionFilter implements ExceptionFilter {
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exception_response = exception.getResponse();
    const message =
      typeof exception_response === "string"
        ? exception_response
        : (exception_response as { message?: string }).message || "An unknown error occurred";

    response.status(status).json({
      success: false,
      error: {
        code: ErrorCode.CONFLICT,
        message,
      },
    });
  }
}
