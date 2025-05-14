import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Between, EntityManager, FindOptionsWhere, In, Like, ObjectLiteral } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

import { FilterDTO } from "@shared/dto";
import { IBaseRepository, IBrowsingRepository } from "@shared/repositories";
import {
  ProductCategoryEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductImageEntity,
  ProductOptionEntity,
  ProductOptionGroupEntity,
  ProductPriceEntity,
  ProductTagEntity,
} from "@product/infrastructure/entities";
import { ProductCatalogView, ProductSummaryView } from "@browsing/infrastructure/views";
import { ProductCatalogDTO } from "@browsing/presentation/dto";
import { CommandHandler, ProductInputDTO } from "../command";
import { QueryHandler } from "../query";

@Injectable()
export default class ProductService implements CommandHandler, QueryHandler {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IProductRepository")
    private readonly repository: IBaseRepository<ProductEntity>,
    @Inject("IProductDetailRepository")
    private readonly product_detail_repository: IBaseRepository<ProductDetailEntity>,
    @Inject("IProductPriceRepository")
    private readonly product_price_repository: IBaseRepository<ProductPriceEntity>,
    @Inject("IProductCategoryRepository")
    private readonly product_category_repository: IBaseRepository<ProductCategoryEntity>,
    @Inject("IProductOptionsRepository")
    private readonly product_options_repository: IBaseRepository<ProductOptionEntity>,
    @Inject("IProductOptionGroupRepository")
    private readonly product_option_group_repository: IBaseRepository<ProductOptionGroupEntity>,
    @Inject("IProductImageRepository")
    private readonly product_image_repository: IBaseRepository<ProductImageEntity>,
    @Inject("IProductTagRepository")
    private readonly product_tag_repository: IBaseRepository<ProductTagEntity>,
    @Inject("IProductSummaryRepository")
    private readonly product_summary_repository: IBrowsingRepository<ProductSummaryView>,
    @Inject("IProductCatalogRepository")
    private readonly product_catalog_repository: IBrowsingRepository<ProductCatalogView>,
  ) {}

  async register({
    seller_id,
    brand_id,
    detail,
    price,
    categories,
    option_groups,
    images,
    tags: tag_ids,
    ...product
  }: ProductInputDTO) {
    // 상품 등록 트랜잭션 처리
    const product_entity = await this.entity_manager.transaction(async (manager) => {
      // 상품 등록
      const product_entity = await this.repository.with_transaction(manager).save({
        ...product,
        seller: { id: seller_id },
        brand: { id: brand_id },
      });
      const { id: product_id } = product_entity;

      // 상품 상세 등록
      await this.product_detail_repository.with_transaction(manager).save({
        ...detail,
        product: { id: product_id },
      });

      // 상품 가격 등록
      await this.product_price_repository.with_transaction(manager).save({
        ...price,
        product: { id: product_id },
      });

      // 상품 카테고리 등록
      await this.product_category_repository.with_transaction(manager).save(
        categories.map(({ category_id, is_primary }) => ({
          product: { id: product_id },
          category: { id: category_id },
          is_primary,
        })),
      );

      // 상품 옵션 등록
      for (const { options, ...group_data } of option_groups) {
        const option_group_entity = await this.product_option_group_repository
          .with_transaction(manager)
          .save({
            ...group_data,
            product: { id: product_id },
          });

        await this.product_options_repository.with_transaction(manager).save(
          options.map((option) => ({
            ...option,
            product: { id: product_id },
            option_group: option_group_entity,
          })),
        );
      }

      await this.product_option_group_repository
        .with_transaction(manager)
        .save(option_groups.map((group) => ({ ...group, product_id })));

      // 상품 이미지 등록
      await this.product_image_repository.with_transaction(manager).save(
        images.map(({ option_id, ...image }) => ({
          ...image,
          product: { id: product_id },
          option: { id: option_id ?? undefined },
        })),
      );

      // 상품 태그 등록
      await this.product_tag_repository
        .with_transaction(manager)
        .save(tag_ids.map((id) => ({ tag: { id }, product: { id: product_id } })));

      return product_entity;
    });
    // 반환 형식 변환
    const { id, name, slug, created_at, updated_at } = product_entity;
    return { id, name, slug, created_at, updated_at };
  }

  async find_all({
    page = 1,
    per_page = 10,
    sort,
    status,
    max_price,
    min_price,
    category: categories,
    seller: seller_id,
    brand: brand_id,
    in_stock,
    search,
  }: FilterDTO) {
    const [sort_field, sort_order] = sort?.split(":") ?? ["created_at", "DESC"];

    const items = await this.product_summary_repository.find({
      where: {
        status,
        base_price: Between(min_price ?? 0, max_price ?? Number.MAX_SAFE_INTEGER),
        categories: In(categories ?? []),
        ...(seller_id ? { seller: { id: seller_id } } : {}),
        ...(brand_id ? { brand: { id: brand_id } } : {}),
        in_stock,
        name: Like(`%${search ?? ""}%`),
      },
      order: { [sort_field]: sort_order },
      skip: (page - 1) * per_page,
      take: per_page,
    });

    // 페이지네이션 요약 정보
    const pagination = {
      total_items: items.length,
      total_pages: Math.ceil(items.length / (per_page ?? 10)),
      current_page: page ?? 1,
      per_page: per_page ?? 10,
    };

    return { items, pagination };
  }

  async find(id: number) {
    const product = await this.product_catalog_repository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Product", resourceId: id },
      });
    }
    return product as ProductCatalogDTO;
  }

  async edit(
    product_id: number,
    {
      seller_id,
      brand_id,
      detail,
      price,
      categories,
      option_groups,
      images,
      tags: tag_ids,
      ...product
    }: ProductInputDTO,
  ) {
    const updated = await this.entity_manager.transaction(async (manager) => {
      // 에러 핸들링을 위한 헬퍼 함수
      async function update_or_fail<T extends ObjectLiteral>(
        repo: IBaseRepository<T>,
        where: FindOptionsWhere<T>,
        data: QueryDeepPartialEntity<T>,
      ) {
        const { affected } = await repo.with_transaction(manager).update(where, data);
        if (!affected) {
          throw new NotFoundException({
            message: `이 제품에 해당하는 ${repo.metadata.tableName} 리소스를 찾을 수 없습니다.`,
            details: { resourceType: repo.metadata.tableName },
          });
        }
      }

      // 정합성 체크
      const product_entity = await this.repository
        .with_transaction(manager)
        .findOneBy({ id: product_id });

      if (!product_entity) {
        throw new NotFoundException({
          message: "요청한 리소스를 찾을 수 없습니다.",
          details: { resourceType: "Product", resourceId: product_id },
        });
      }

      // 상품 제품 업데이트
      await update_or_fail(
        this.repository,
        { id: product_id },
        { seller: { id: seller_id }, brand: { id: brand_id }, ...product },
      );

      // 상품 디테일 업데이트
      await update_or_fail(this.product_detail_repository, { product: { id: product_id } }, detail);

      // 상품 가격 업데이트
      await update_or_fail(this.product_price_repository, { product: { id: product_id } }, price);

      // 상품 카테고리 업데이트
      for (const { category_id, ...category } of categories) {
        await update_or_fail(
          this.product_category_repository,
          { product: { id: product_id }, category: { id: category_id } },
          category,
        );
      }

      // 상품 옵션 그룹 업데이트
      for (const { options, ...group_data } of option_groups) {
        await update_or_fail(
          this.product_option_group_repository,
          { product: { id: product_id } },
          group_data,
        );

        const option_group_entity = await this.product_option_group_repository
          .with_transaction(manager)
          .findOneBy({
            product: { id: product_id },
          });

        // 상품 옵션 업데이트
        await this.product_options_repository
          .with_transaction(manager)
          .delete({ option_group: option_group_entity! });
        await this.product_options_repository.with_transaction(manager).save(
          options.map((option) => ({
            ...option,
            option_group: option_group_entity!,
          })),
        );
      }

      // 상품 이미지 업데이트
      for (const { option_id, ...image } of images) {
        await update_or_fail(
          this.product_image_repository,
          { product: { id: product_id }, option: { id: option_id ?? undefined } },
          image,
        );
      }

      // 상품 태그 업데이트
      await this.product_tag_repository
        .with_transaction(manager)
        .delete({ product: { id: product_id } });
      await this.product_tag_repository
        .with_transaction(manager)
        .save(tag_ids.map((id) => ({ tag: { id }, product: { id: product_id } })));

      // 업데이트 반환
      return product_entity;
    });

    // 반환 형식 변환
    const { id, name, slug, updated_at } = updated;
    return { id, name, slug, updated_at };
  }

  async remove(id: number) {
    const { affected } = await this.repository.delete(id);

    if (!affected) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Product", resourceId: id },
      });
    }
  }
}
