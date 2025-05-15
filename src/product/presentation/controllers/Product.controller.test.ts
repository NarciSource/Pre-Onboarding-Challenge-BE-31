import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { TestingModule } from "@nestjs/testing";

import { get_module } from "__test-utils__/test-module";

import { ProductEntity } from "@product/infrastructure/entities";
import { ProductCatalogView, ProductSummaryView } from "@browsing/infrastructure/views";
import { ProductCatalogDTO } from "@browsing/presentation/dto";
import {
  ParamDTO,
  ProductBodyDTO,
  ProductQueryDTO,
  ProductResponseBundle,
  ProductResponseDTO,
  ResponseDTO,
} from "../dto";
import ProductController from "./Product.controller";

describe("ProductController", () => {
  let controller: ProductController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeAll(async () => {
    const module: TestingModule = await get_module();

    controller = module.get(ProductController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it("상품 등록", async () => {
    const body = { name: "상품1" } as ProductBodyDTO;
    const response: ResponseDTO<ProductResponseDTO> = {
      success: true,
      data: { id: 1, created_at: new Date(), updated_at: new Date(), ...body },
      message: "상품이 성공적으로 등록되었습니다.",
    };
    commandBus.execute = jest.fn().mockResolvedValue(response.data as ProductEntity);

    const result = await controller.create(body);

    expect(result).toEqual(response);
    expect(commandBus.execute).toHaveBeenCalledWith({ dto: body });
  });

  it("상품 목록 조회", async () => {
    const query = { page: 1, perPage: 10 } as ProductQueryDTO;
    const items = [
      {
        id: 1,
        name: "상품1",
        slug: "product-1",
        created_at: new Date(),
        status: "available",
      },
    ] as ProductSummaryView[];
    const pagination = { total_items: 1, total_pages: 1, current_page: 1, per_page: 10 };
    const response: ResponseDTO<ProductResponseBundle> = {
      success: true,
      data: { items, pagination },
      message: "상품 목록을 성공적으로 조회했습니다.",
    };
    queryBus.execute = jest.fn().mockResolvedValue({ items, pagination });

    const result = await controller.read_all(query);

    expect(result).toEqual(response);
    expect(queryBus.execute).toHaveBeenCalledWith({ dto: query });
  });

  it("상품 상세 조회", async () => {
    const param: ParamDTO = { id: 1 };
    const data = {
      id: 1,
      name: "상품1",
      slug: "product-1",
      created_at: new Date(),
      updated_at: new Date(),
      status: "available",
    } as ProductCatalogView;
    const response: ResponseDTO<ProductCatalogDTO> = {
      success: true,
      data,
      message: "상품 상세 정보를 성공적으로 조회했습니다.",
    };
    queryBus.execute = jest.fn().mockResolvedValue(data);

    const result = await controller.read(param);

    expect(result).toEqual(response);
    expect(queryBus.execute).toHaveBeenCalledWith({ id: param.id });
  });

  it("상품 수정", async () => {
    const param: ParamDTO = { id: 1 };
    const body = { name: "상품1 수정" } as ProductBodyDTO;
    const data = {
      id: 1,
      name: "상품1",
      slug: "product-1",
      updated_at: new Date(),
      created_at: new Date(),
    };
    const response: ResponseDTO<ProductResponseDTO> = {
      success: true,
      data,
      message: "상품이 성공적으로 수정되었습니다.",
    };
    commandBus.execute = jest.fn().mockResolvedValue(data);

    const result = await controller.update(param, body);

    expect(result).toEqual(response);
    expect(commandBus.execute).toHaveBeenCalledWith({ id: param.id, dto: body });
  });

  it("상품을 삭제", async () => {
    const param = { id: 1 } as ParamDTO;
    const response: ResponseDTO<null> = {
      success: true,
      data: null,
      message: "상품이 성공적으로 삭제되었습니다.",
    };
    commandBus.execute = jest.fn().mockResolvedValue(undefined);

    const result = await controller.delete(param);

    expect(result).toEqual(response);
    expect(commandBus.execute).toHaveBeenCalledWith({ id: param.id });
  });
});
