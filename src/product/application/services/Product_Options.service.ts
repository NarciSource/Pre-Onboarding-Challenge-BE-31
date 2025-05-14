import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { EntityManager } from "typeorm";

import { IBaseRepository } from "@shared/repositories";
import { Product_Image, Product_Option } from "@product/domain/entities";
import {
  ProductImageEntity,
  ProductOptionEntity,
  ProductOptionGroupEntity,
} from "@product/infrastructure/entities";
import { OptionsCommandHandler } from "../command";

@Injectable()
export default class ProductOptionsService implements OptionsCommandHandler {
  constructor(
    private readonly entity_manager: EntityManager,
    @Inject("IProductOptionsRepository")
    private readonly repository: IBaseRepository<ProductOptionEntity>,
    @Inject("IProductOptionGroupRepository")
    private readonly option_group_repository: IBaseRepository<ProductOptionGroupEntity>,
    @Inject("IProductImageRepository")
    private readonly product_image_repository: IBaseRepository<ProductImageEntity>,
  ) {}

  async register(
    product_id: number,
    option_group_id: number,
    option: Omit<Product_Option, "id" | "option_group_id">,
  ) {
    const saved = await this.entity_manager.transaction(async (manager) => {
      // 정합성 체크
      const option_group_entity = await this.option_group_repository
        .with_transaction(manager)
        .findOne({
          where: { id: option_group_id },
          relations: { product: true },
        });

      if (!option_group_entity) {
        throw new NotFoundException({
          message: "요청한 옵션 그룹을 찾을 수 없습니다.",
          details: { resourceType: "OptionGroup", resourceId: option_group_id },
        });
      }

      if (option_group_entity.product.id != product_id) {
        throw new ForbiddenException({
          message: "해당 옵션 그룹은 요청한 상품에 속하지 않습니다.",
          details: {
            expectedProductId: option_group_entity.product.id,
            receivedProductId: product_id,
          },
        });
      }

      return await this.repository.with_transaction(manager).save({
        ...option,
        option_group: option_group_entity,
      });
    });

    // 반환 형식 변환
    const { option_group, ...result } = saved;
    return { ...result, option_group_id: option_group.id };
  }

  async edit(
    product_id: number,
    option_id: number,
    options: Omit<Product_Option, "id" | "option_group_id">,
  ) {
    const updated = await this.entity_manager.transaction(async (manager) => {
      // 정합성 체크
      const option_entity = await this.repository.with_transaction(manager).findOne({
        where: { id: option_id },
        relations: { option_group: { product: true } },
      });

      if (!option_entity) {
        throw new NotFoundException({
          message: "요청한 옵션을 찾을 수 없습니다.",
          details: { resourceType: "Option", resourceId: option_id },
        });
      }

      if (option_entity.option_group.product.id != product_id) {
        throw new ForbiddenException({
          message: "해당 옵션은 요청한 상품에 속하지 않습니다.",
          details: {
            expectedProductId: option_entity.option_group.product.id,
            receivedProductId: product_id,
          },
        });
      }

      // 상품 옵션 업데이트
      Object.assign(option_entity, options);
      return await this.repository.with_transaction(manager).save(option_entity);
    });

    // 반환 형식 변환
    const { option_group, ...rest } = updated;
    return { ...rest, option_group_id: option_group.id };
  }

  async remove(product_id: number, option_id: number): Promise<void> {
    const delete_success = await this.entity_manager.transaction(async (manager) => {
      const option_entity = await this.repository.with_transaction(manager).findOne({
        where: { id: option_id },
        relations: { option_group: { product: true } },
      });

      if (!option_entity) {
        throw new NotFoundException({
          message: "요청한 옵션을 찾을 수 없습니다.",
          details: { resourceType: "Option", resourceId: option_id },
        });
      }

      if (option_entity.option_group.product.id != product_id) {
        throw new ForbiddenException({
          message: "해당 옵션은 요청한 상품에 속하지 않습니다.",
          details: {
            expectedProductId: option_entity.option_group.product.id,
            receivedProductId: product_id,
          },
        });
      }

      const { affected } = await this.repository.with_transaction(manager).delete(option_id);
      return affected !== 0;
    });

    if (!delete_success) {
      throw new InternalServerErrorException("옵션 삭제에 실패했습니다.");
    }
  }

  async register_images(
    product_id: number,
    option_id: number | null,
    image: Omit<Product_Image, "id" | "product" | "option">,
  ) {
    const saved_product_image = await this.product_image_repository.save({
      product: { id: product_id },
      option: option_id ? { id: option_id } : null,
      ...image,
    });

    // 이미지 저장 결과 반환
    const { product: _product, option, ...rest } = saved_product_image;
    return { ...rest, option_id: option ? option.id : null };
  }
}
