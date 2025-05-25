import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@libs/domain/repository";

import {
  ProductCategoryEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductImageEntity,
  ProductOptionEntity,
  ProductOptionGroupEntity,
  ProductPriceEntity,
  ProductTagEntity,
} from "product/infrastructure/rdb/entities";
import RegisterCommand from "./Register.command";

@CommandHandler(RegisterCommand)
export default class RegisterHandler implements ICommandHandler<RegisterCommand> {
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
  ) {}

  async execute({
    dto: {
      seller_id,
      brand_id,
      detail,
      price,
      categories,
      option_groups,
      images,
      tags: tag_ids,
      ...product
    },
  }: RegisterCommand) {
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
}
