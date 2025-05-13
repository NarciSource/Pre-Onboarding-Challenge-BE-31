import { Catch, InternalServerErrorException, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";

import ErrorCode from "../constants/ErrorCode";

@Catch(InternalServerErrorException)
export default class InternalServerErrorExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const body = exception.getResponse() as {
      message: string;
      details?: string[];
    };

    response.status(status).json({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: body.message ?? "서버 내부 오류가 발생했습니다.",
        details: body.details ?? [],
      },
    });
  }
}
