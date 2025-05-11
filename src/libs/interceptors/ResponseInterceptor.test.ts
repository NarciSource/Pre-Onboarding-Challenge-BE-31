import { CallHandler, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { of } from "rxjs";

import ResponseInterceptor, { RESPONSE_DTO_KEY } from "./ResponseInterceptor";

describe("ResponseInterceptor", () => {
  let interceptor: ResponseInterceptor;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new ResponseInterceptor(reflector);
  });

  it("DTO 클래스가 정의되지 않은 경우 그대로 통과", () => {
    const context = {
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn().mockReturnValue(of("test data")),
    };

    jest.spyOn(reflector, "get").mockReturnValue(undefined);

    const result$ = interceptor.intercept(context, next);

    result$.subscribe((result) => {
      expect(result).toBe("test data");
    });

    expect(reflector.get).toHaveBeenCalledWith(RESPONSE_DTO_KEY, context.getHandler());
    expect(next.handle).toHaveBeenCalled();
  });

  it("응답 데이터를 DTO 클래스를 사용하여 변환", () => {
    class TestDto {
      constructor(public value: string) {}
    }

    const context = {
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn().mockReturnValue(of({ value: "test" })),
    };

    jest.spyOn(reflector, "get").mockReturnValue(TestDto);

    const result$ = interceptor.intercept(context, next);

    result$.subscribe((result) => {
      expect(result).toBeInstanceOf(TestDto);
      expect(result).toEqual(new TestDto("test"));
    });

    expect(reflector.get).toHaveBeenCalledWith(RESPONSE_DTO_KEY, context.getHandler());
    expect(next.handle).toHaveBeenCalled();
  });

  it("응답 데이터 배열을 DTO 클래스를 사용하여 변환", () => {
    class TestDto {
      constructor(public value: string) {}
    }

    const context = {
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    const next: CallHandler = {
      handle: jest.fn().mockReturnValue(of([{ value: "test1" }, { value: "test2" }])),
    };

    jest.spyOn(reflector, "get").mockReturnValue(TestDto);

    const result$ = interceptor.intercept(context, next);

    result$.subscribe((result: TestDto[]) => {
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(TestDto);
      expect(result[0]).toEqual(new TestDto("test1"));
      expect(result[1]).toBeInstanceOf(TestDto);
      expect(result[1]).toEqual(new TestDto("test2"));
    });

    expect(reflector.get).toHaveBeenCalledWith(RESPONSE_DTO_KEY, context.getHandler());
    expect(next.handle).toHaveBeenCalled();
  });
});
