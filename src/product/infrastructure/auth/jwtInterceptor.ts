import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

import verifier from "./verifier";

@Injectable()
export class JwtInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorizationHeader = request.headers["authorization"];
    const token =
      typeof authorizationHeader === "string" ? authorizationHeader.split(" ")[1] : undefined; // 'Bearer <token>'
    const controller = context.getClass();

    // 메인 컨트롤러는 JWT 검증을 하지 않음
    if (controller.name === "MainController") {
      return next.handle();
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = await verifier.verify(token);
      (request as { user?: unknown }).user = decoded;
    } catch {
      throw new ForbiddenException();
    }

    return next.handle();
  }
}
