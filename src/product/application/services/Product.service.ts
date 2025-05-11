import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Between, EntityManager, In, Like } from "typeorm";

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
import { FilterDTO, ProductInputDTO } from "../dto";

@Injectable()
export default class ProductService {
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
    detail,
    price,
    categories,
    option_groups,
    images,
    tags: tag_ids,
    seller_id,
    brand_id,
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
      const saved_option_groups = await this.product_option_group_repository
        .with_transaction(manager)
        .save(
          option_groups.map(({ options: _options, ...group }) => ({
            ...group,
            product: { id: product_id },
          })),
        );
      await this.product_options_repository.with_transaction(manager).save(
        option_groups.flatMap(
          ({ options }, index) =>
            options?.map((option) => ({
              ...option,
              product: { id: product_id },
              option_group: { id: saved_option_groups[index].id },
            })) ?? [],
        ),
      );

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
    // 상품 등록 결과 반환
    return (({ id, name, slug, created_at, updated_at }) => ({
      id: id,
      name,
      slug,
      created_at,
      updated_at,
    }))(product_entity);
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
    const product = await this.product_catalog_repository.findOne({ where: { id } });

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
    { detail, seller_id, brand_id, price, categories, ...product }: ProductInputDTO,
  ) {
    const is_updated = await this.entity_manager.transaction(async (manager) => {
      // 상품 디테일 업데이트
      await this.product_detail_repository.with_transaction(manager).update(product_id, detail);

      // 상품 가격 업데이트
      await this.product_price_repository.with_transaction(manager).update(product_id, price);

      // 상품 카테고리 업데이트
      for (const { category_id, is_primary } of categories) {
        await this.product_category_repository.with_transaction(manager).update(
          {
            product: { id: product_id },
          },
          { is_primary, category: { id: category_id } },
        );
      }

      // 상품 제품 업데이트
      return this.repository.with_transaction(manager).update(
        {
          product: { id: product_id },
        } as Partial<ProductEntity>,
        {
          seller: { id: seller_id },
          brand: { id: brand_id },
          ...product,
        },
      );
    });

    if (!is_updated) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Product", resourceId: product_id },
      });
    }

    const updated_product = await this.product_catalog_repository.findOne({
      where: { id: product_id },
    });

    return (({ id, name, slug, updated_at }) => ({
      id,
      name,
      slug,
      updated_at,
    }))(updated_product!);
  }

  async remove(id: number) {
    const is_deleted = await this.repository.delete(id);

    if (!is_deleted) {
      throw new NotFoundException({
        message: "요청한 리소스를 찾을 수 없습니다.",
        details: { resourceType: "Product", resourceId: id },
      });
    }
  }
}
