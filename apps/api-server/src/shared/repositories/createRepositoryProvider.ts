import { Provider } from "@nestjs/common";
import { ObjectLiteral, EntityTarget, DataSource } from "typeorm";

import { IViewRepository } from "@libs/domain/repository";

import IBaseRepository from "../../../../../libs/domain/src/repository/IBaseRepository";
import base_repository_mixin from "./base.repository.mixin";

export default function createRepositoryProvider<T extends ObjectLiteral>(
  token: string,
  entity: EntityTarget<T>,
  repository?: Partial<IBaseRepository<T> | IViewRepository<T>>,
): Provider {
  return {
    provide: token,
    inject: [DataSource],
    useFactory: (data_source: DataSource) =>
      data_source
        .getRepository(entity)
        .extend(base_repository_mixin)
        .extend(repository ?? {}),
  };
}
