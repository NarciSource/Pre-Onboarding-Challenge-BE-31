# CQRS 시스템 설계/구축 챌린지

> 원티드 프리온보딩 챌린지 백엔드 31차

[![GitHub release](https://img.shields.io/github/v/release/narcisource/Pre-Onboarding-Challenge-BE-31)](https://github.com/narcisource/Pre-Onboarding-Challenge-BE-31/releases) [![openapi](https://github.com/narcisource/Pre-Onboarding-Challenge-BE-31/actions/workflows/deploy-openapi.yml/badge.svg)](https://github.com/narcisource/Pre-Onboarding-Challenge-BE-31/actions/workflows/deploy-openapi.yml) [![test](https://github.com/narcisource/Pre-Onboarding-Challenge-BE-31/actions/workflows/deploy-test-report.yml/badge.svg)](https://github.com/narcisource/Pre-Onboarding-Challenge-BE-31/actions/workflows/deploy-test-report.yml)

## 기술 스택

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/) [![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/ko) [![TypesSript](https://img.shields.io/badge/TypesSript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=flat&logo=typeorm&logoColor=white)](https://typeorm.io/)  
[![Codecov](https://img.shields.io/badge/Codecov-F01F7A?style=flat&logo=codecov&logoColor=white)](https://about.codecov.io/) [![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/) [![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/)  
[![Github Actions](https://img.shields.io/badge/Github_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)](https://github.com/features/actions) [![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/) [![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black)](https://prettier.io/)  
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-2AB4FF.svg?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MjMgNjY1Ij4KICA8cGF0aCBmaWxsPSIjZmNmY2ZjIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00MTggMWMtNiAxLTkgMy0xMyA4LTQgMy00IDMtMTAgMS0xMi02LTYwIDAtNjYgOC01IDYtMTEgNDQtOCA1MGwyMyAxN2M3IDQgNyA2IDIgNy0yMyAzLTM3IDI5LTI5IDUyIDMgOSAzIDktMTAgNi0xOS01LTI0LTYtNDUtNS00NyAwLTg2IDE4LTEwOSA1MGExMzUgMTM1IDAgMCAwLTI0IDY0Yy0zIDI4IDIgNDggMTcgNzJsMjIgMjdjNDAgNDQgNDEgNjYgMyA5MS00NSAzMC0xMDQgMTktMTA2LTIwLTEtMTYgNC0yOSAxNy01MiAxMy0yNCAxNC0zMyAzLTUybDEzLThjMjQtMTIgMjItOSAyMy0zNCAwLTIyIDItMjAtMjMtMzAtMTgtNi0yMC02LTQwLTEtMjggOS00MCAxNC00MSAxOCAwIDItMSAzLTIgMy03IDAtMTQgMTItMTUgMjUtMSAyMSA2IDI5IDMwIDM2IDMwIDkgMzUgMjQgMTkgNDktMzYgNTMtMzIgMTAyIDExIDEyMSAzNSAxNiA3NCAxMyAxMTktOWwxMS01IDMgMzJjMCAzNC00MCAzOC04OSA4bC0xNi0xMGMtNTEtMjktMTAyIDI0LTY2IDcwIDE1IDIwIDQyIDIxIDQ2IDIgMi04IDAtMTEtMTAtMTktMTYtMTItMTctMjQtMi0yNyA1LTEgMjYgOCAyOCAxMmwzNCAyOSAyMCAxMiAyMCA4YzM2IDEzIDgyLTE1IDgyLTUwIDAtMTAgMC0xMCA2LTUgMTAgMTAgMTggMTYgMjMgMTkgNiAzIDYgNCAxIDctNSAyLTUgMi01IDctMSA4IDEgMjkgNCAzMyA0IDcgNjMgNDYgNjkgNDYgMyAwIDQ4LTI1IDUxLTI5IDItMSAzLTM0IDEtMzZsLTE2LTljLTE2LTgtMTYtOC05LTEwIDE5LTcgMzctMjcgNDMtNDdsNS0xYTE2NSAxNjUgMCAwIDAgNjAtMTNjOSAwIDM0LTIyIDQwLTM0bDQtOGM0LTcgNi0yNiA2LTU2IDAtMjkgMS0yNy0xMC0yOS02LTItOC0zLTEzLTgtMzAtMjktNzktMjMtOTYgMTAtMyA3LTMgNy04IDlzLTYgNS01IDE3djE1YzEgMTQgNCAxNiAzNCAyOGwxMiA2YzcgMyA3IDMgMzAtNyA4LTMgOS0zIDkgMS02IDIyLTY0IDQyLTczIDI0YTg3IDg3IDAgMCAwLTYzLTQyYy04IDAtOCAwIDYtMTFhNzM2IDczNiAwIDAgMCA4NS04OWwzLTVjMTktMzEgMjEtNzMgMy0xMDctNy0xNS0yMy0zNS0zNi00OC0zOS0zNi00Ni00Ny0zOC02MiA0LTggMTUtMTcgMjAtMTVhNDUyIDQ1MiAwIDAgMCA1NS0xMmMxMS00IDEzLTUgMTQtMTAgMC00IDItNyA5LTE0IDI0LTI2LTgtODAtNDMtNzFNMjI4IDMzNGMxIDEgMCAxLTEgMS0yMCAwLTI4IDMyLTEyIDQyIDE3IDkgMzctMyAzNy0yMiAwLTctNy0xNy0xMS0xN3YtMWMzLTIgMC0zLTctNGwtNiAxbTU0IDgtNCAxYy0yMiAzLTI1IDM5LTMgNDQgMjQgNSA0MS0yMSAyNS0zOGwtNS0zdi0zYy0xLTItMTQtMy0xMy0xbS00OSAxMjBjLTYgNy05IDE0LTkgMjQgMCA4IDEgMTIgMyA2IDItMTIgOC0yOCAxMy0zM3YtM2MtMSAwLTQgMi03IDZtOTcgNGMwIDIgMjMgMTcgMjcgMTcgMiAwIDEtMy00LTctOS03LTIzLTEzLTIzLTEwbS01NCA2Yy0yMSA1MSAyOSA5NiA3MyA2NyA4LTYgOC03LTEtOC0zOS0zLTYzLTIzLTY2LTU0LTItMTItMy0xMy02LTUiLz4KPC9zdmc+Cg==&style=flat&logoColor=black)](https://docs.docker.com/compose/) [![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white)](https://www.docker.com/)

## API 명세서

본 프로젝트의 API 명세서는 GitHub Pages을 통해 Swagger UI로 제공됩니다.

| [![Swagger](https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swagger/swagger-original.svg)](https://narcisource.github.io/Pre-Onboarding-Challenge-BE-31/) |
| --- |
| &nbsp;&nbsp;&nbsp;[API 명세서 바로가기](https://narcisource.github.io/Pre-Onboarding-Challenge-BE-31/)&nbsp;&nbsp;&nbsp; |

- GitHub Pages에 게시된 Swagger 문서는 **정적 문서용**으로 제공되며,  
  백엔드 서버 및 데이터베이스가 연결되어 있지 않기 때문에 실제 요청은 처리되지 않습니다.

- API 요청을 정상적으로 테스트하려면,  
  로컬 환경에서 Docker Compose를 사용해 서버와 데이터베이스를 실행한 후 Swagger UI에 접속합니다.

## 테스트 리포트

테스트 통과 여부와 커버리지 현황은 시각적으로 제공됩니다.

| [![Jest](https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg)](https://narcisource.github.io/Pre-Onboarding-Challenge-BE-31/test-report) | [![Codecov](https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/codecov/codecov-plain.svg)](https://codecov.io/gh/narcisource/Pre-Onboarding-Challenge-BE-31) |
| --- | --- |
| [테스트 리포트 바로가기](https://narcisource.github.io/Pre-Onboarding-Challenge-BE-31/test-report) | [커버리지 대시보드 바로가기](https://codecov.io/gh/narcisource/Pre-Onboarding-Challenge-BE-31) |

커버리지는 Codecov를 통해 분석됩니다.  
[![codecov](https://codecov.io/gh/NarciSource/Pre-Onboarding-Challenge-BE-31/branch/challenge/NarciSource/graph/badge.svg)](https://codecov.io/gh/NarciSource/test)

![Sunburst-graph](https://codecov.io/gh/narcisource/Pre-Onboarding-Challenge-BE-31/graphs/sunburst.svg)

## 폴더 구조

<details>
<summary>열기</summary>

```
Pre-Onboarding-Challenge-BE-31
├─ data
│  ├─ 01.ddl.sql
│  ├─ 02.sellers.sql
│  ├─ 03.brands.sql
│  ├─ 04.categories.sql
│  ├─ 05.tags.sql
│  ├─ 06.products.sql
│  ├─ 07.product_options.sql
│  ├─ 08.product_extended.sql
│  ├─ 09.users.sql
│  └─ 10.reviews.sql
├─ src
│  ├─ utility
│  │  ├─ downloadOpenAPI.ts
│  │  ├─ generatorSwagger.ts
│  │  └─ extractDTOExample.ts
│  ├─ libs
│  │  ├─ config
│  │  │  └─ index.ts
│  │  │     ├─ typeorm.config.ts
│  │  │     └─ mongo.config.ts
│  │  ├─ constants
│  │  │  └─ ErrorCode.ts
│  │  ├─ decorators
│  │  │  └─ index.ts
│  │  │     ├─ ApiErrorResponse.ts
│  │  │     ├─ ApiStandardResponse.ts
│  │  │     └─ ResponseType.ts
│  │  ├─ filters
│  │  │  └─ index.ts
│  │  │     ├─ BadRequestExceptionFilter.ts
│  │  │     ├─ ConflictExceptionFilter.ts
│  │  │     ├─ ForbiddenExceptionFilter.ts
│  │  │     ├─ internalServerErrorExceptionFilter.ts
│  │  │     ├─ NotFoundExceptionFilter.ts
│  │  │     ├─ QueryFailedExceptionFilter.ts
│  │  │     └─ UnauthorizedExceptionFilter.ts
│  │  └─ interceptors
│  │     └─ ResponseInterceptor.ts
│  │        └─ ResponseInterceptor.test.ts
│  ├─ shared
│  │  ├─ dto
│  │  │  └─ index.ts
│  │  │     ├─ Error.dto.ts
│  │  │     │  └─ Error.dto.test.ts
│  │  │     ├─ Filter.dto.ts
│  │  │     ├─ PaginationSummary.dto.ts
│  │  │     │  └─ PaginationSummary.dto.test.ts
│  │  │     ├─ Param.dto.ts
│  │  │     │  └─ Param.dto.test.ts
│  │  │     └─ Response.dto.ts
│  │  │        └─ Response.dto.test.ts
│  │  ├─ mappers
│  │  │  └─ index.ts
│  │  │     └─ to_FilterDTO.ts
│  │  └─ repositories
│  │     └─ index.ts
│  │        ├─ IBaseRepository.ts
│  │        ├─ IQueryRepository.ts
│  │        ├─ IViewRepository.ts
│  │        ├─ base.repository.mixin.ts
│  │        └─ createRepositoryProvider.ts
│  ├─ product
│  │  ├─ module.ts
│  │  ├─ domain
│  │  │  └─ entities
│  │  │     └─ index.ts
│  │  │        ├─ Brand.ts
│  │  │        ├─ Product.ts
│  │  │        ├─ Product_Detail.ts
│  │  │        ├─ Product_Image.ts
│  │  │        ├─ Product_Option.ts
│  │  │        ├─ Product_Price.ts
│  │  │        ├─ Seller.ts
│  │  │        └─ Tag.ts
│  │  ├─ application
│  │  │  ├─ command
│  │  │  │  └─ index.ts
│  │  │  │     ├─ Register.command.ts
│  │  │  │     │  ├─ Register.handler.ts
│  │  │  │     │  └─ Register.handler.test.ts
│  │  │  │     ├─ Edit.command.ts
│  │  │  │     │  ├─ Edit.handler.ts
│  │  │  │     │  └─ Edit.handler.test.ts
│  │  │  │     ├─ Remove.command.ts
│  │  │  │     │  ├─ Remove.handler.ts
│  │  │  │     │  └─ Remove.handler.test.ts
│  │  │  │     ├─ OptionRegister.command.ts
│  │  │  │     │  ├─ OptionRegister.handler.ts
│  │  │  │     │  └─ OptionRegister.handler.test.ts
│  │  │  │     ├─ OptionEdit.command.ts
│  │  │  │     │  ├─ OptionEdit.handler.ts
│  │  │  │     │  └─ OptionEdit.handler.test.ts
│  │  │  │     ├─ OptionRemove.command.ts
│  │  │  │     │  ├─ OptionRemove.handler.ts
│  │  │  │     │  └─ OptionRemove.handler.test.ts
│  │  │  │     └─ ImageRegister.command.ts
│  │  │  │        ├─ ImageRegister.handler.ts
│  │  │  │        └─ ImageRegister.handler.test.ts
│  │  │  └─ query
│  │  │     └─ index.ts
│  │  │        ├─ Find.query.ts
│  │  │        │  ├─ Find.handler.ts
│  │  │        │  └─ Find.handler.test.ts
│  │  │        └─ FindAll.query.ts
│  │  │           ├─ FindAll.handler.ts
│  │  │           └─ FindAll.handler.test.ts
│  │  ├─ infrastructure
│  │  │  ├─ auth
│  │  │  │  ├─ jwtInterceptor.ts
│  │  │  │  └─ verifier.ts
│  │  │  ├─ rdb
│  │  │  │  └─ entities
│  │  │  │     └─ index.ts
│  │  │  │        ├─ Brand.entity.ts
│  │  │  │        │  └─ Brand.entity.test.ts
│  │  │  │        ├─ Product.entity.ts
│  │  │  │        │  └─ Product.entity.test.ts
│  │  │  │        ├─ Product_Category.entity.ts
│  │  │  │        │  └─ Product_Category.entity.test.ts
│  │  │  │        ├─ Product_Detail.entity.ts
│  │  │  │        │  └─ Product_Detail.entity.test.ts
│  │  │  │        ├─ Product_Image.entity.ts
│  │  │  │        │  └─ Product_Image.entity.test.ts
│  │  │  │        ├─ Product_Option.entity.ts
│  │  │  │        │  └─ Product_Option.entity.test.ts
│  │  │  │        ├─ Product_Option_Group.entity.ts
│  │  │  │        │  └─ Product_Option_Group.entity.test.ts
│  │  │  │        ├─ Product_Price.entity.ts
│  │  │  │        │  └─ Product_Price.entity.test.ts
│  │  │  │        ├─ Product_Tag.entity.ts
│  │  │  │        │  └─ Product_Tag.entity.test.ts
│  │  │  │        ├─ Seller.entity.ts
│  │  │  │        │  └─ Seller.entity.test.ts
│  │  │  │        └─ Tag.entity.ts
│  │  │  │           └─ Tag.entity.test.ts
│  │  │  └─ repositories
│  │  │     └─ index.ts
│  │  │        └─ provider.ts
│  │  └─ presentation
│  │     ├─ dto
│  │     │  └─ index.ts
│  │     │     ├─ model
│  │     │     │  ├─ Brand.dto.ts
│  │     │     │  │  └─ Brand.dto.test.ts
│  │     │     │  └─ image.dto.ts
│  │     │     │  │  └─ image.dto.test.ts
│  │     │     │  ├─ ProductDetail.dto.ts
│  │     │     │  │  └─ ProductDetail.dto.test.ts
│  │     │     │  ├─ ProductOption.dto.ts
│  │     │     │  │  └─ ProductOption.dto.test.ts
│  │     │     │  ├─ ProductOptionGroup.dto.ts
│  │     │     │  │  └─ ProductOptionGroup.dto.test.ts
│  │     │     │  ├─ ProductPrice.dto.ts
│  │     │     │  │  └─ ProductPrice.dto.test.ts
│  │     │     │  ├─ Seller.dto.ts
│  │     │     │  │  └─ Seller.dto.test.ts
│  │     │     │  └─ Tag.dto.ts
│  │     │     │     └─ Tag.dto.test.ts
│  │     │     ├─ request
│  │     │     │  ├─ ProductBody.dto.ts
│  │     │     │  │  └─ ProductBody.dto.test.ts
│  │     │     │  ├─ ProductQuery.dto.ts
│  │     │     │  │  └─ ProductQuery.dto.test.ts
│  │     │     │  ├─ ProductOptionBody.dto.ts
│  │     │     │  └─ ProductOptionImageBody.dto.ts
│  │     │     └─ response
│  │     │        ├─ ProductResponse.dto.ts
│  │     │        │  └─ ProductResponse.dto.test.ts
│  │     │        └─ ProductResponseBundle.dto.ts
│  │     │           └─ ProductResponseBundle.dto.test.ts
│  │     └─ controllers
│  │        └─ index.ts
│  │           ├─ Product.controller.ts
│  │           │  └─ Product.controller.test.ts
│  │           └─ Product_Options.controller.ts
│  │              └─ Product_Options.controller.test.ts
│  ├─ category
│  │  ├─ module.ts
│  │  ├─ domain
│  │  │  └─ entities
│  │  │     └─ index.ts
│  │  │        └─ Category.ts
│  │  ├─ application
│  │  │  └─ query
│  │  │     └─ index.ts
│  │  │        ├─ FindAll.query.ts
│  │  │        │  ├─ FindAll.handler.ts
│  │  │        │  └─ FindAll.handler.test.ts
│  │  │        └─ FindProducts.query.ts
│  │  │           ├─ FindProducts.handler.ts
│  │  │           └─ FindProducts.handler.test.ts
│  │  ├─ infrastructure
│  │  │  └─ rdb
│  │  │     ├─ entities
│  │  │     │  └─ index.ts
│  │  │     │     ├─ Category.entity.ts
│  │  │     │     └─ Category.entity.test.ts
│  │  │     └─ repositories
│  │  │        ├─ index.ts
│  │  │        └─ provider.ts
│  │  └─ presentation
│  │     ├─ controllers
│  │     │  └─ index.ts
│  │     │     └─ Category.controller.ts
│  │     │        └─ Category.controller.test.ts
│  │     └─ dto
│  │        └─ index.ts
│  │           ├─ Category.dto.ts
│  │           │  └─ Category.dto.test.ts
│  │           ├─ CategoryQuery.dto.ts
│  │           │  └─ CategoryQuery.dto.test.ts
│  │           ├─ CategoryResponseBundle.dto.ts
│  │           │  └─ CategoryResponseBundle.dto.test.ts
│  │           └─ NestedCategory.dto.ts
│  │              └─ NestedCategory.dto.test.ts
│  ├─ review
│  │  ├─ module.ts
│  │  ├─ domain
│  │  │  └─ entities
│  │  │     └─ index.ts
│  │  │        ├─ Review.ts
│  │  │        └─ User.ts
│  │  ├─ application
│  │  │  ├─ command
│  │  │  │  └─ index.ts
│  │  │  │     ├─ Register.command.ts
│  │  │  │     │  ├─ Register.handler.ts
│  │  │  │     │  └─ Register.handler.test.ts
│  │  │  │     ├─ Edit.command.ts
│  │  │  │     │  ├─ Edit.handler.ts
│  │  │  │     │  └─ Edit.handler.test.ts
│  │  │  │     └─ Remove.command.ts
│  │  │  │        ─ Remove.handler.ts
│  │  │  │        └─ Remove.handler.test.ts
│  │  │  └─ query
│  │  │     └─ index.ts
│  │  │        └─ Find.query.ts
│  │  │           ├─ Find.handler.ts
│  │  │           └─ Find.handler.test.ts
│  │  ├─ infrastructure
│  │  │  └─ rdb
│  │  │     ├─ entities
│  │  │     │  └─ index.ts
│  │  │     │     ├─ Review.entity.ts
│  │  │     │     │  └─ Review.entity.test.ts
│  │  │     │     └─ User.entity.ts
│  │  │     │        └─ User.entity.test.ts
│  │  │     └─ repositories
│  │  │        └─ index.ts
│  │  │           └─ provider.ts
│  │  └─ presentation
│  │     ├─ dto
│  │     │  └─ index.ts
│  │     │     ├─ Review.dto.ts
│  │     │     │  └─ Review.dto.test.ts
│  │     │     ├─ ReviewBody.dto.ts
│  │     │     │  └─ ReviewBody.dto.test.ts
│  │     │     ├─ ReviewQuery.dto.ts
│  │     │     │  └─ ReviewQuery.dto.test.ts
│  │     │     ├─ ReviewResponse.dto.ts
│  │     │     │  └─ ReviewResponse.dto.test.ts
│  │     │     ├─ ReviewResponseBundle.dto.ts
│  │     │     │  └─ ReviewResponseBundle.dto.test.ts
│  │     │     ├─ ReviewSummary.dto.ts
│  │     │     │  └─ ReviewSummary.dto.test.ts
│  │     │     └─ User.dto.ts
│  │     └─ controllers
│  │        └─ index.ts
│  │           └─ Review.controller.ts
│  │              └─ Review.controller.test.ts
│  ├─ browsing
│  │  ├─ module.ts
│  │  ├─ application
│  │  │  ├─ event
│  │  │  │  └─ index.ts
│  │  │  │     ├─ QueryRegister.event.ts
│  │  │  │     │  ├─ QueryRegister.handler.ts
│  │  │  │     │  └─ QueryRegister.handler.test.ts
│  │  │  │     ├─ QueryUpdate.event.ts
│  │  │  │     │  ├─ QueryUpdate.handler.ts
│  │  │  │     │  └─ QueryUpdate.handler.test.ts
│  │  │  │     └─ QueryRemove.event.ts
│  │  │  │        ├─ QueryRemove.handler.test.ts
│  │  │  │        └─ QueryRemove.handler.ts
│  │  │  └─ query
│  │  │     └─ index.ts
│  │  │        └─ Find.query.ts
│  │  │           ├─ Find.handler.ts
│  │  │           └─ Find.handler.test.ts
│  │  ├─ infrastructure
│  │  │  ├─ rdb
│  │  │  │  ├─ views
│  │  │  │  │  └─ index.ts
│  │  │  │  │     ├─ CategoryCatalog.view.ts
│  │  │  │  │     │  └─ CategoryCatalog.view.test.ts
│  │  │  │  │     ├─ ProductCatalog.view.ts
│  │  │  │  │     │  └─ ProductCatalog.view.test.ts
│  │  │  │  │     └─ ProductSummary.view.ts
│  │  │  │  │        └─ ProductSummary.view.test.ts
│  │  │  │  └─ repositories
│  │  │  │     └─ index.ts
│  │  │  │        ├─ product_summary.repository.mixin.ts
│  │  │  │        └─ provider.ts
│  │  │  └─ mongo
│  │  │     ├─ models
│  │  │     │  ├─ index.ts
│  │  │     │  │  ├─ CategoryCatalog.model.ts
│  │  │     │  │  ├─ ProductCatalog.model.ts
│  │  │     │  │  ├─ ProductSummary.model.ts
│  │  │     │  │  └─ provider.ts
│  │  │     │  └─ sub
│  │  │     │     ├─ Brand.model.ts
│  │  │     │     ├─ Category.model.ts
│  │  │     │     ├─ Detail.model.ts
│  │  │     │     ├─ Image.model.ts
│  │  │     │     ├─ Option.model.ts
│  │  │     │     ├─ OptionGroup.model.ts
│  │  │     │     ├─ Price.model.ts
│  │  │     │     ├─ Rating.model.ts
│  │  │     │     ├─ Seller.model.ts
│  │  │     │     └─ Tag.model.ts
│  │  │     └─ repositories
│  │  │        └─ index.ts
│  │  │           ├─ createRepositoryProvider.ts
│  │  │           ├─ provider.ts
│  │  │           └─ Query.repository.ts
│  │  │              └─ Query.repository.test.ts
│  │  └─ presentation
│  │     ├─ dto
│  │     │  └─ index.ts
│  │     │     ├─ MainResponseBundle.dto.ts
│  │     │     │  └─ MainResponseBundle.dto.test.ts
│  │     │     ├─ ProductCatalog.dto.ts
│  │     │     │  └─ ProductCatalog.dto.test.ts
│  │     │     └─ ProductSummary.dto.ts
│  │     │        └─ ProductSummary.dto.test.ts
│  │     └─ controllers
│  │        └─ index.ts
│  │           └─ Main.controller.ts
│  │              └─ Main.controller.test.ts
│  ├─ __mocks__
│  │  └─ entityManagerMock.ts
│  ├─ __test-utils__
│  │  ├─ getValidateDTO.ts
│  │  └─ test-module.ts
│  ├─ main.ts
│  └─ module.ts
├─ .env
├─ docker-compose.yml
│  └─ Dockerfile
├─ jest.config.ts
│  ├─ jest.global-setup.ts
│  └─ jest.teardown.ts
├─ package.json
│  ├─ package-lock.json
│  ├─ .prettierrc
│  ├─ eslint.config.mjs
│  └─ nest-cli.json
├─ README.md
└─ tsconfig.json
   └─ tsconfig.build.json
```

</details>

## 실행 방법

### 도커환경

Docker Compose를 활용하여 서버와 데이터베이스를 각각 별도의 컨테이너로 구성하고, 공통 네트워크 환경에서 실행되도록 설정합니다.  
이를 통해 개발 및 테스트 환경에서의 서비스 간 통신을 간편하게 구성합니다.

```sh
# build
$ docker-compose build

# run
$ docker-compose up -d
```

### 서버 접근

서버는 환경변수 파일(.env)에 정의된 `PORT` 번호를 통해 외부 호스트에서 접근할 수 있습니다.  
기본 포트는 `3000`으로 설정되어 있으며, 로컬 환경에서 서버에 접속하려면 다음 주소를 이용합니다.

- 애플리케이션 접속: http://localhost:3000
- Swagger 문서 페이지: http://localhost:3000/swagger-ui/index.html
