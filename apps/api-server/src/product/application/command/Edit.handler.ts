import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EntityManager, FindOptionsWhere, ObjectLiteral } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

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
} from "@libs/infrastructure/rdb/entities";

import EditCommand from "./Edit.command";

@CommandHandler(EditCommand)
export default class EditHandler implements ICommandHandler<EditCommand> {
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
    id: product_id,
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
  }: EditCommand) {
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
        .save(tag_ids.map((id) => ({ tag: { id }, product: { id: id } })));

      // 업데이트 반환
      return product_entity;
    });

    // 반환 형식 변환
    const { id, name, slug, updated_at } = updated;
    return { id, name, slug, updated_at };
  }
}
