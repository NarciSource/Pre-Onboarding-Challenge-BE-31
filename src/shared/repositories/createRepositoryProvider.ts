import { Provider } from "@nestjs/common";
import { ObjectLiteral, EntityTarget, DataSource } from "typeorm";

import base_repository_mixin from "./base.repository.mixin";
import IBaseRepository from "./IBaseRepository";
import IBrowsingRepository from "./IBrowsingRepository";

export default function createRepositoryProvider<T extends ObjectLiteral>(
  token: string,
  entity: EntityTarget<T>,
  repository?: Partial<IBaseRepository<T> | IBrowsingRepository<T>>,
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
